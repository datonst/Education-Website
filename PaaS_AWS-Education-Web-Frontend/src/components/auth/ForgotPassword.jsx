import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthCard from './AuthCard';
import FormInput from './FormInput';
import Button from './Button';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [step, setStep] = useState(1);
    const { forgotPassword, forgotPasswordSubmit, loading, error } = useAuth();
    const navigate = useNavigate();

    const validateEmail = () => {
        let errors = {};
        let isValid = true;

        if (!email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email address is invalid';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const validateReset = () => {
        let errors = {};
        let isValid = true;

        if (!code) {
            errors.code = 'Verification code is required';
            isValid = false;
        }

        if (!newPassword) {
            errors.newPassword = 'New password is required';
            isValid = false;
        } else if (newPassword.length < 8) {
            errors.newPassword = 'Password must be at least 8 characters';
            isValid = false;
        }

        if (!confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleRequestCode = async (e) => {
        e.preventDefault();

        if (!validateEmail()) {
            return;
        }

        try {
            await forgotPassword(email);
            setStep(2);
        } catch (err) {
            throw Error(err);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!validateReset()) {
            return;
        }

        try {
            await forgotPasswordSubmit(email, code, newPassword);
            navigate('/login', {
                state: {
                    message: 'Password reset successful! Please sign in with your new password.'
                }
            });
        } catch (err) {
            throw Error(err);
        }
    };

    return (
        <AuthCard
            title={step === 1 ? "Reset your password" : "Set new password"}
            subtitle={step === 1
                ? "Enter your email and we'll send you a code to reset your password"
                : "Enter the code sent to your email and create a new password"
            }
        >
            {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
                    {error}
                </div>
            )}

            {step === 1 ? (
                <form className="mt-8 space-y-6" onSubmit={handleRequestCode}>
                    <FormInput
                        id="email"
                        label="Email address"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (formErrors.email) {
                                setFormErrors({
                                    ...formErrors,
                                    email: '',
                                });
                            }
                        }}
                        error={formErrors.email}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        }
                    />

                    <Button type="submit" fullWidth isLoading={loading}>
                        Send reset code
                    </Button>

                    <div className="text-center mt-4 space-y-2">
                        <p className="text-sm text-gray-600">
                            Remember your password?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </Link>
                        </p>
                        <p className="text-sm text-gray-600">
                            Need to verify your email?{' '}
                            <Link to="/verify-email" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Verify email
                            </Link>
                        </p>
                    </div>
                </form>
            ) : (
                <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                    <FormInput
                        id="code"
                        label="Verification Code"
                        type="text"
                        required
                        placeholder="Enter the code sent to your email"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            if (formErrors.code) {
                                setFormErrors({
                                    ...formErrors,
                                    code: '',
                                });
                            }
                        }}
                        error={formErrors.code}
                    />

                    <FormInput
                        id="newPassword"
                        label="New Password"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (formErrors.newPassword) {
                                setFormErrors({
                                    ...formErrors,
                                    newPassword: '',
                                });
                            }
                        }}
                        error={formErrors.newPassword}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        }
                    />

                    <FormInput
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        autoComplete="new-password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (formErrors.confirmPassword) {
                                setFormErrors({
                                    ...formErrors,
                                    confirmPassword: '',
                                });
                            }
                        }}
                        error={formErrors.confirmPassword}
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        }
                    />

                    <Button type="submit" fullWidth isLoading={loading}>
                        Reset Password
                    </Button>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-600">
                            Didn't receive the code?{' '}
                            <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => forgotPassword(email)}
                            >
                                Resend code
                            </button>
                        </p>
                    </div>
                </form>
            )}
        </AuthCard>
    );
};

export default ForgotPassword;
