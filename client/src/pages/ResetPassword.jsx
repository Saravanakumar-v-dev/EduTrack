import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Loader as LoaderIcon, Key, ArrowRight } from 'lucide-react';
import authService from '../services/authService'; // Your service
import { toast } from 'react-hot-toast';

// Utility to parse URL query strings (kept for token-link fallback)
const useQuery = () => new URLSearchParams(useLocation().search);

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = useQuery();
    
    // 1. **CRITICAL FIX**: Try to get email and OTP/Token from location.state first (passed from ForgotPasswordCode)
    const stateEmail = location.state?.email;
    const stateOtp = location.state?.otp; 
    
    // Fallback 1: Check URL query parameters (for email-link flow)
    const queryEmail = query.get('email');
    const queryToken = query.get('token');

    // Determine the active verification data
    const finalEmail = stateEmail || queryEmail;
    const finalVerificationCode = stateOtp || queryToken; // Use OTP or Token as the key

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Initial check for required data
    useEffect(() => {
        if (!finalEmail || !finalVerificationCode) {
            setError('Invalid or incomplete password reset session. Please start the process again.');
        }
    }, [finalEmail, finalVerificationCode]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        // Final check before API call
        if (!finalEmail || !finalVerificationCode) {
            setError('Verification data missing. Please restart the process.');
            return;
        }
        
        setIsLoading(true);

        try {
            // --- ACTUAL API CALL: Reset Password ---
            // Calls POST /api/auth/reset-password-otp
            const response = await authService.resetPasswordWithOtp({
                email: finalEmail,
                otp: finalVerificationCode, // Send the verified OTP/Code
                newPassword: newPassword,
            });

            // SUCCESS MESSAGE FOR PASSWORD CHANGE:
            setSuccess(response.message || 'Password successfully reset! Redirecting to login...');
            toast.success(response.message || 'Password reset successful!');

            // Redirect to login page after successful reset
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 2000);
            
        } catch (err) {
            console.error('Password Reset Error:', err.response?.data?.message || err.message);
            setError(err.response?.data?.message || 'Password reset failed. The code may have expired or been used.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 transition";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header Section */}
                <div className="p-8 bg-indigo-600 dark:bg-indigo-700 text-white">
                    <h1 className="text-3xl font-bold text-center flex items-center justify-center">
                        <Key className="w-6 h-6 mr-3" /> Set New Password
                    </h1>
                    <p className="mt-2 text-center text-indigo-200">
                        Changing password for <span className="font-semibold">{finalEmail || "your account"}</span>.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Status Messages */}
                    {(error || success) && (
                        <div
                            className={`${error ? 'bg-red-100 dark:bg-red-900 border-red-500 text-red-700' : 'bg-green-100 dark:bg-green-900 border-green-500 text-green-700'} border-l-4 p-4 rounded`}
                            role="alert"
                        >
                            <p className="font-semibold">{error ? 'Error' : 'Success'}</p>
                            <p className="text-sm">{error || success}</p>
                        </div>
                    )}
                    
                    {/* Show form only if link is valid and no success message is displayed */}
                    {(!error && !success) && (
                        <>
                            {/* New Password Input */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="New Password (min. 8 chars)"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className={inputClasses}
                                    disabled={isLoading}
                                />
                            </motion.div>

                            {/* Confirm New Password Input */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className={inputClasses}
                                    disabled={isLoading}
                                />
                            </motion.div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                                ) : (
                                    <ArrowRight className="w-5 h-5 mr-2" />
                                )}
                                {isLoading ? 'Updating Password...' : 'Change Password'}
                            </motion.button>
                        </>
                    )}
                    
                    {/* Go back to login link */}
                    {success && (
                        <div className="text-center pt-4">
                            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                                Go to Login
                            </Link>
                        </div>
                    )}
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;