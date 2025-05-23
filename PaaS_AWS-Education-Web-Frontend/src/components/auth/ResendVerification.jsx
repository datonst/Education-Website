import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthCard from './AuthCard';
import FormInput from './FormInput';
import Button from './Button';

const ResendVerification = () => {
    const [email, setEmail] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [step, setStep] = useState(1); // 1: email form, 2: verification code
    const [successMessage, setSuccessMessage] = useState('');
    const { resendSignUpCode, confirmSignUp, loading, error } = useAuth();
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
    };    const handleResendCode = async (e) => {
        e.preventDefault();

        if (!validateEmail()) {
            return;
        }

        try {
            await resendSignUpCode(email);  
            // Đảm bảo chuyển sang bước 2 để nhập mã xác thực
            setStep(2);
            setSuccessMessage('Verification code has been sent to your email address');
        } catch (err) {
            // Error is already handled in context, but we can provide additional guidance
            if (err.message && err.message.includes('User is already confirmed')) {
                setSuccessMessage('Your account is already verified! Please go to the login page.');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else if (err.message && err.message.includes('User does not exist')) {
                setFormErrors({
                    ...formErrors,
                    email: 'This email is not registered. Please sign up first.'
                });
            }
            // Other errors are handled by the AuthContext
        }
    };

    const handleConfirmSubmit = async (e) => {
        e.preventDefault();

        if (!confirmationCode) {
            setFormErrors({
                ...formErrors,
                confirmationCode: 'Verification code is required',
            });
            return;
        }

        try {
            await confirmSignUp(email, confirmationCode);
            navigate('/login', {
                state: {
                    message: 'Email verification successful! Please sign in with your account.'
                }
            });
        } catch (err) {
            throw Error(err);
        }
    };

    return (
        <AuthCard
            title={step === 1 ? "Resend Verification Code" : "Verify your email"}
            subtitle={step === 1
                ? "Enter your email to resend verification code"
                : "We've sent a code to your email address"
            }
        >
            {successMessage && (
                <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
                    {error}
                </div>
            )}

            {step === 1 ? (
                <form className="mt-8 space-y-6" onSubmit={handleResendCode}>
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
                    />                    <Button type="submit" fullWidth isLoading={loading}>
                        Send Verification Code
                    </Button>

                    <div className="text-center mt-4 space-y-2">
                        <p className="text-sm text-gray-600">
                            Remember your password?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </Link>
                        </p>
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </form>
            ) : (
                <form className="mt-8 space-y-6" onSubmit={handleConfirmSubmit}>
                    <FormInput
                        id="confirmationCode"
                        label="Verification Code"
                        type="text"
                        required
                        placeholder="Enter the code sent to your email"
                        value={confirmationCode}
                        onChange={(e) => {
                            setConfirmationCode(e.target.value);
                            if (formErrors.confirmationCode) {
                                setFormErrors({
                                    ...formErrors,
                                    confirmationCode: '',
                                });
                            }
                        }}
                        error={formErrors.confirmationCode}
                    />

                    <Button type="submit" fullWidth isLoading={loading}>
                        Verify Email
                    </Button>

                    <div className="text-center mt-4 space-y-2">
                        <p className="text-sm text-gray-600">
                            Didn't receive the code?{' '}                            
                            <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => {
                                    resendSignUpCode(email);
                                    setSuccessMessage('Verification code has been sent again to your email address');
                                    // Không cần setStep vì đã ở bước 2
                                }}
                            >
                                Resend code
                            </button>
                        </p>
                        <p className="text-sm text-gray-600">
                            <button
                                type="button"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                onClick={() => setStep(1)}
                            >
                                Change email address
                            </button>
                        </p>
                    </div>
                </form>
            )}
        </AuthCard>
    );
};

export default ResendVerification;
