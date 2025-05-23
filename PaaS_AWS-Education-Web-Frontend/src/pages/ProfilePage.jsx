import { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import UserProfile from '../components/profile/UserProfile';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const {loading } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // Redirect to login if not authenticated is handled by ProtectedRoute

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-12 w-12 rounded-full border-t-4 border-indigo-600 border-solid"></div>
            </div>
        );
    }

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Creator Dashboard</h1>
                        <p className="mt-1 text-gray-600">Manage your account details and content preferences</p>
                    </div>

                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="flex overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`whitespace-nowrap py-3 px-5 border-b-2 font-medium text-sm ${activeTab === 'profile'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`whitespace-nowrap py-3 px-5 border-b-2 font-medium text-sm ${activeTab === 'security'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Security
                                </button>
                                <button
                                    onClick={() => setActiveTab('preferences')}
                                    className={`whitespace-nowrap py-3 px-5 border-b-2 font-medium text-sm ${activeTab === 'preferences'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Preferences
                                </button>
                            </nav>
                        </div>
                        <div className="p-6">
                            {activeTab === 'profile' && <UserProfile />}
                            {activeTab === 'security' && (
                                <div className="bg-white p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                                    <div className="space-y-4">
                                        <div className="p-4 border border-gray-200 rounded-md hover:border-indigo-500 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Password</h3>
                                                    <p className="text-sm text-gray-500">Update your password to secure your account</p>
                                                </div>
                                                <Link
                                                    to="/change-password"
                                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm transition-colors"
                                                >
                                                    Change Password
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="p-4 border border-gray-200 rounded-md hover:border-indigo-500 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                                                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                                </div>
                                                <button
                                                    onClick={() => alert('This feature is coming soon!')}
                                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm transition-colors"
                                                >
                                                    Coming Soon
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'preferences' && (
                                <div className="bg-white p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
                                    <div className="space-y-4">
                                        <div className="border border-gray-200 rounded-md p-4">
                                            <h3 className="font-medium text-gray-900 mb-4">Email Notifications</h3>
                                            <div className="space-y-3">
                                                {['Course updates', 'New resources', 'Promotions', 'Newsletter'].map((item) => (
                                                    <div key={item} className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={item.toLowerCase().replace(/\s+/g, '-')}
                                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                        />
                                                        <label htmlFor={item.toLowerCase().replace(/\s+/g, '-')} className="ml-2 text-sm text-gray-700">
                                                            {item}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="border border-gray-200 rounded-md p-4">
                                            <h3 className="font-medium text-gray-900 mb-4">Display Settings</h3>
                                            <div className="space-y-3">
                                                <div className="flex items-center">
                                                    <span className="text-sm text-gray-700 mr-4">Theme:</span>
                                                    <select className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                                                        <option>Light</option>
                                                        <option>Dark</option>
                                                        <option>System Default</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <button
                                                onClick={() => alert('Preferences saved!')}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                                            >
                                                Save Preferences
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ProfilePage;
