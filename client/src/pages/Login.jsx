import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Mail, Lock, Loader as LoaderIcon, ArrowRight, Key } from 'lucide-react';
import { Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion'; // Keep motion for animation variants
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
    // State management
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Context Hooks
    const { login, isLoggedIn, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Memoized Event Handlers
    const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
    const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    };

    // Effect for handling redirects and state cleanup
    useEffect(() => {
        if (location.state?.redirectError) {
            toast.error(location.state.redirectError);
            navigate(location.pathname, { replace: true, state: {} });
        }
        // CRITICAL FIX: Ensure local storage token logic is removed if present
        // localStorage.removeItem('token'); // Only remove if your setup still requires it
    }, [location.state, location.pathname, navigate]);

    // Form Submission Logic
    const handleLoginSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Email and password required.');
            return;
        }
        setIsLoading(true);

        try {
            // 1. Call backend API
            const userData = await authService.loginUser({ email, password });
            
            // 2. SUCCESS: Update frontend state via context function
            login(userData); 
            // Redirect is handled by AuthContext state change / ProtectedRoute

        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    }, [email, password, login]);

    // Forgot Password Email Request Handler
    const handleForgotPasswordSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Email required to send the code.');
            return;
        }
        setIsLoading(true);
        try {
            // Placeholder: Replace with actual authService.requestPasswordResetOtp({ email });
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            toast.success('Code request successful! Redirecting...');
            setTimeout(() => navigate('/forgot-password-code', { state: { email } }), 1000); 

        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Failed to send code.');
        } finally {
            setIsLoading(false);
        }
    }, [email, navigate]);


    // Determine View State
    const [isForgotPasswordFlow, setIsForgotPasswordFlow] = useState(false); // New state to manage form view
    const toggleView = useCallback(() => {
        setIsForgotPasswordFlow(prev => !prev);
        setEmail('');
        setPassword('');
    }, []);

    const formTitle = isForgotPasswordFlow ? 'Forgot Password' : 'Welcome Back';
    const formSubtitle = isForgotPasswordFlow ? 'Enter email for verification code' : 'Please sign in to your account';

    // Conditional Rendering / Redirects
    if (authLoading) {
        // Return a simple loader screen wrapper
        return <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900"><div className="loader"></div></div>;
    }
    if (isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    // Input Styling
    const inputClasses = "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition";

    // --- JSX ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="p-8 bg-indigo-600 text-white">
                    <h1 className="text-3xl font-bold text-center">{formTitle}</h1>
                    <p className="mt-2 text-center text-indigo-200">{formSubtitle}</p>
                </div>

                {/* Form: Uses conditional handler based on view state */}
                <form
                    onSubmit={isForgotPasswordFlow ? handleForgotPasswordSubmit : handleLoginSubmit}
                    className="p-8 space-y-6"
                >
                    {/* EMAIL Input */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="email" name="email" placeholder="Email Address" value={email} onChange={handleEmailChange} required className={inputClasses} disabled={isLoading} />
                    </motion.div>

                    {/* PASSWORD Input (Only visible in Login view) */}
                    {!isForgotPasswordFlow && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="password" name="password" placeholder="Password" value={password} onChange={handlePasswordChange} required className={inputClasses} disabled={isLoading} />
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button 
                        type="submit" 
                        disabled={isLoading || authLoading} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: isForgotPasswordFlow ? 0 : 0.2 }}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50"
                    >
                        {isLoading ? (<LoaderIcon className="w-5 h-5 mr-2 animate-spin" />) : isForgotPasswordFlow ? (<Key className="w-5 h-5 mr-2" />) : (<ArrowRight className="w-5 h-5 mr-2" />)}
                        {isLoading ? 'Processing...' : isForgotPasswordFlow ? 'Send Reset Code' : 'Sign In'}
                    </motion.button>

                    {/* Footer Links */}
                    <div className="text-center pt-2 text-sm flex justify-between">
                        {/* Forgot Password Toggle Button (Now uses onClick to change view state) */}
                        <button
                            type="button"
                            onClick={toggleView}
                            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                        >
                            {isForgotPasswordFlow ? '← Back to Login' : 'Forgot Password?'}
                        </button>
                        
                        {/* Create Account Link (Only visible in Login view) */}
                        {!isForgotPasswordFlow && (
                            <Link 
                                to="/register" 
                                className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
                            >
                                Create Account
                            </Link>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;