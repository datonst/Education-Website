import { createContext, useContext, useState, useEffect } from 'react';
import {
    signIn as amplifySignIn, signUp as amplifySignUp, confirmSignUp as amplifyConfirmSignUp,
    signOut as amplifySignOut, resetPassword, confirmResetPassword,
    updatePassword,
    resendSignUpCode as amplifyResendSignUpCode
} from 'aws-amplify/auth';
import { createUserProfile, getCurrentUserProfile } from '../services/UserService';

// Create Authentication Context
const AuthContext = createContext();

// Export AuthContext so components can import and use it
export { AuthContext };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is already authenticated
    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const userData = await getCurrentUserProfile();
                setUser(userData);
            } catch (err) {
                setUser(null);
                throw Error(err);
            } finally {
                setLoading(false);
            }
        };

        checkAuthState();
    }, []);

    // Sign in function
    const signIn = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { isSignedIn, nextStep } = await amplifySignIn({ username: email, password });

            if (isSignedIn) {
                try {
                    // Use getCurrentUserProfile from userService instead of AWS Cognito's getCurrentUser
                    const userData = await getCurrentUserProfile();

                    // Combine profile data from API with Cognito attributes
                    setUser(userData);
                } catch (profileErr) {
                    throw Error(profileErr);
                }
            }

            return { isSignedIn, nextStep };
        } catch (err) {
            setError(err.message || 'Failed to sign in');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Sign up function
    const signUp = async (email, password, attributes = {}) => {
        setLoading(true);
        setError(null);
        try {
            // Format the birthdate as required by Cognito (ISO format)
            let userAttributes = { ...attributes, email };

            // Handle the cognito required attributes
            if (attributes.birthdate) {
                userAttributes['birthdate'] = attributes.birthdate;
            }

            if (attributes.gender) {
                userAttributes['gender'] = attributes.gender;
            }

            const result = await amplifySignUp({
                username: email,
                password,
                options: {
                    userAttributes
                }
            });
            // Tạo profile trong MongoDB ngay sau khi đăng ký
            await createUserProfile({
                userId: result.userId || email.replace(/[@.]/g, '-'),
                email: email,
                name: userAttributes.name || email.split('@')[0],
                gender: userAttributes.gender || '',
                birthdate: userAttributes.birthdate || ''
            });
            // Store password and attributes temporarily for use during confirmation
            sessionStorage.setItem(`temp_password_${email}`, password);
            sessionStorage.setItem(`temp_attributes_${email}`, JSON.stringify(userAttributes));
            return result;
        } catch (err) {
            setError(err.message || 'Failed to sign up');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Confirm sign up function
    const confirmSignUp = async (email, code) => {
        setLoading(true);
        setError(null);
        try {
            // Confirm the signup with Cognito
            const result = await amplifyConfirmSignUp({
                username: email,
                confirmationCode: code
            });

            // Clean up stored data
            sessionStorage.removeItem(`temp_password_${email}`);
            sessionStorage.removeItem(`temp_attributes_${email}`);

            return result;
        } catch (err) {
            setError(err.message || 'Failed to confirm sign up');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Sign out function
    const signOut = async () => {
        setLoading(true);
        setError(null);
        try {
            await amplifySignOut();
            setUser(null);
        } catch (err) {
            setError(err.message || 'Failed to sign out');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Reset password function (previously forgotPassword)
    const forgotPassword = async (email) => {
        setLoading(true);
        setError(null);
        try {
            return await resetPassword({ username: email });
        } catch (err) {
            setError(err.message || 'Failed to initiate password reset');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Complete password reset function (previously forgotPasswordSubmit)
    const forgotPasswordSubmit = async (email, code, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            return await confirmResetPassword({
                username: email,
                confirmationCode: code,
                newPassword
            });
        } catch (err) {
            setError(err.message || 'Failed to reset password');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Change password function
    const changePassword = async (oldPassword, newPassword) => {
        setLoading(true);
        setError(null);
        try {
            return await updatePassword({
                oldPassword,
                newPassword
            });
        } catch (err) {
            setError(err.message || 'Failed to change password');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Resend sign up verification code
    const resendSignUpCode = async (email) => {
        setLoading(true);
        setError(null);
        try {
            return await amplifyResendSignUpCode({
                username: email
            });
        } catch (err) {
            setError(err.message || 'Failed to resend verification code');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        signIn,
        signUp,
        confirmSignUp,
        signOut,
        forgotPassword,
        forgotPasswordSubmit,
        changePassword,
        resendSignUpCode,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
