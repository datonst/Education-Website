import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthCard from './AuthCard';
import FormInput from './FormInput';
import Button from './Button';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const [success, setSuccess] = useState('');
    const { changePassword, loading, error } = useAuth();
    const navigate = useNavigate();

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

        if (!formData.oldPassword) {
            errors.oldPassword = 'Current password is required';
            isValid = false;
        }

        if (!formData.newPassword) {
            errors.newPassword = 'New password is required';
            isValid = false;
        } else if (formData.newPassword.length < 8) {
            errors.newPassword = 'Password must be at least 8 characters';
            isValid = false;
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
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
            await changePassword(formData.oldPassword, formData.newPassword);
            setSuccess('Your password has been changed successfully');

            // Clear form
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            // Error is handled in context
            throw Error(err);
        }
    };

    return (
        <AuthCard
            title="Change your password"
            subtitle="Update your password to keep your account secure"
        >
            {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
                    {success}
                </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <FormInput
                    id="oldPassword"
                    label="Current Password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    error={formErrors.oldPassword}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    }
                />

                <FormInput
                    id="newPassword"
                    label="New Password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={handleChange}
                    error={formErrors.newPassword}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    }
                />

                <FormInput
                    id="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={formErrors.confirmPassword}
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                    }
                />

                <div className="flex space-x-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/dashboard')}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" fullWidth isLoading={loading}>
                        Update Password
                    </Button>
                </div>
            </form>
        </AuthCard>
    );
};

export default ChangePassword;
