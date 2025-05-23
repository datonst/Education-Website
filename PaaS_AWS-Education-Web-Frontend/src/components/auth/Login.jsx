import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthCard from './AuthCard';
import FormInput from './FormInput';
import Button from './Button';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const { signIn, loading, error } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Check for success message in location state (e.g., from registration)
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clean up state to prevent showing message after refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });

        // Clear errors when user starts typing
        if (formErrors[id]) {
            setFormErrors({
                ...formErrors,
                [id]: '',
            });
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!formData.email) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email address is invalid';
            isValid = false;
        }

        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await signIn(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            throw Error(err);
        }
    };

    return (
        <AuthCard
            title="Sign in to your account"
            subtitle="Welcome back, please enter your details"
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

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <FormInput
                    id="email"
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    error={formErrors.email}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                    }
                />

                <FormInput
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    error={formErrors.password}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    }
                />

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
                    </div>

                    <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot your password?
                    </Link>
                </div>

                <Button type="submit" fullWidth isLoading={loading}>
                    Sign in
                </Button>

                <div className="text-center mt-4 space-y-2">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </Link>
                    </p>
                    <p className="text-sm text-gray-600">
                        Already registered but need verification?{' '}
                        <Link to="/verify-email" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Resend verification
                        </Link>
                    </p>
                </div>
            </form>
        </AuthCard>
    );
};

export default Login;
