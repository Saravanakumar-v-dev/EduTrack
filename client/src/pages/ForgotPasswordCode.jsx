import React, { useState, useEffect } from 'react';
import { Key, Loader as LoaderIcon, ArrowRight, Mail, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import authService from '../services/authService'; // Import your service
import { toast } from 'react-hot-toast';

const ForgotPasswordCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if email was passed from the Login page state
    const email = location.state?.email; 

    const [code, setCode] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Redirect to login if no email is in state (user navigated here directly)
    useEffect(() => {
        if (!email) {
            navigate('/login', { replace: true, state: { redirectError: 'Please start the password reset process from the login screen.' } });
        }
    }, [email, navigate]);

    // Render nothing if email is missing until the redirect takes effect
    if (!email) {
        return null; 
    }

    const inputClasses = "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 transition text-center text-lg tracking-widest";


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!code || code.length !== 6) { // Assuming a 6-digit code
            setError('Please enter the 6-digit code received via email.');
            return;
        }

        setIsLoading(true);

        try {
            // --- ACTUAL API CALL: Verify the OTP ---
            // Send the user-provided code to the backend for secure hash comparison
            const response = await authService.verifyPasswordResetOtp({ email, otp: code });
            
            // On success, redirect to the final password set page
            setSuccess(response.message || 'Code verified! Redirecting to set your new password.');
            toast.success('Code verified!');
            
            // Pass the email AND the verified code to the final reset page.
            setTimeout(() => {
                navigate('/reset-password', { replace: true, state: { email, otp: code } });
            }, 1000);

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Verification failed. Try again.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            // --- ACTUAL API CALL: Request new OTP ---
            await authService.requestPasswordResetOtp({ email });
            
            toast.success('New code sent! Check your email.');

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header Section */}
                <div className="p-8 bg-indigo-600 dark:bg-indigo-700 text-white">
                    <h1 className="text-3xl font-bold text-center flex items-center justify-center">
                        <Key className="w-6 h-6 mr-3" /> Enter Verification Code
                    </h1>
                    <p className="mt-2 text-center text-indigo-200 text-sm">
                        A 6-digit code was sent to <span className="font-semibold">{email}</span>.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Status Messages */}
                    {(error || success) && (
                        <div
                            className={`${error ? 'bg-red-100 dark:bg-red-900 border-red-500 text-red-700' : 'bg-green-100 dark:bg-green-900 border-green-500 text-green-700'} border-l-4 p-4 rounded-xl`}
                            role="alert"
                        >
                            <p className="font-semibold">{error ? 'Error' : 'Success'}</p>
                            <p className="text-sm">{error || success}</p>
                        </div>
                    )}
                    
                    <div className="relative">
                        <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                        <input
                            type="text"
                            placeholder="6-Digit Code"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            required
                            className={inputClasses}
                            maxLength={6}
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <ArrowRight className="w-5 h-5 mr-2" />
                        )}
                        {isLoading ? 'Verifying Code...' : 'Verify Code'}
                    </button>
                    
                    <div className="text-center pt-2 space-y-3">
                        <button
                             type="button"
                             onClick={handleResendCode}
                             className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline disabled:text-gray-500 transition duration-200"
                             disabled={isLoading}
                        >
                           <RotateCcw className="w-4 h-4 mr-1 inline-block" /> Resend Code
                        </button>
                        <Link to="/login" className="block text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition duration-200">
                            Back to Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordCode;