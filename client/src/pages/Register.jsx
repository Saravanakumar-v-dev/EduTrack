import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Loader as LoaderIcon, ArrowRight, CheckCheck, Send, RotateCcw, Edit, Key } from 'lucide-react';
import authService from '../services/authService'; // Use the actual service
import { AuthContext } from '../context/AuthContext'; // Use the actual context

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAwaitingVerification, setIsAwaitingVerification] = useState(false); // State for OTP step

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError(null); // Clear error on input change
    };

    const handleReenterDetails = () => {
        setIsAwaitingVerification(false); // Go back to step 1
        setVerificationCode('');
        setError(null);
        setSuccess(null); // Clear success message when going back
    };

    // --- STEP 1: Request OTP for Student Registration ---
    const handleRequestOtpSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const { name, email, password, confirmPassword } = formData;

        // Frontend Validation
        if (!name || !email || !password || !confirmPassword) { setError('All fields are required.'); return; }
        if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters long.'); return; }

        setIsLoading(true);
        try {
            // --- ACTUAL API CALL: Request OTP ---
            await authService.requestRegistrationOtp({ name, email, role: 'student' }); 
            
            setIsAwaitingVerification(true); // Move to OTP entry step
            setSuccess(`A 6-digit verification code has been sent to ${email}.`);

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.';
            setError(errorMessage); 
            
            // Handle "Email Already Exists" error message from backend
             if (errorMessage.toLowerCase().includes('email is already registered')) {
                 setError(
                    <>
                        This email is already registered. Please {' '}
                        <Link to="/login" className="font-bold text-indigo-700 hover:underline">log in</Link> or {' '}
                        use a different email address.
                    </>
                );
             }
        } finally {
            setIsLoading(false);
        }
    };

    // --- STEP 2: Verify OTP and Complete Student Registration ---
    const handleVerifyOtpSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!verificationCode || verificationCode.length !== 6) {
            setError('Please enter the 6-digit code.');
            return;
        }

        setIsLoading(true);
        try {
            // --- ACTUAL API CALL: Verify OTP and finalize registration ---
            const userData = await authService.verifyRegistrationOtp({
                name: formData.name,
                email: formData.email,
                password: formData.password, // Send password again for creation
                role: 'student', 
                otp: verificationCode // CRITICAL: Sending the user-entered code
            });

            login(userData); // Update AuthContext state, triggers redirect
            setSuccess('Account created! Redirecting...');

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Verification failed. Code may be incorrect or expired.');
        } finally {
            setIsLoading(false);
        }
    };

     // --- Handle Resend Code Request ---
    const handleResendCode = async () => {
        setError(null);
        setSuccess(null);
        setIsLoading(true);
        try {
            // --- ACTUAL API CALL: Resend OTP ---
            await authService.requestRegistrationOtp({ email: formData.email, role: 'student' });
            
            setSuccess(`New code sent to ${formData.email}.`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend code.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Input Styling ---
    const inputClasses = "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition";
    // --- Page Titles ---
    const pageTitle = isAwaitingVerification ? "Verify Your Email" : "Create Student Account";
    const pageSubtitle = isAwaitingVerification ? `Enter the 6-digit code sent to ${formData.email}` : "Sign up to access your profile.";

    // --- Component Return ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-8 bg-indigo-600 text-white">
                    <h1 className="text-3xl font-bold text-center">{pageTitle}</h1>
                    <p className="mt-2 text-center text-indigo-200">{pageSubtitle}</p>
                </div>

                {/* Form: Switches submit handler based on state */}
                <form onSubmit={isAwaitingVerification ? handleVerifyOtpSubmit : handleRequestOtpSubmit} className="p-8 space-y-6">
                    {/* Status Messages */}
                    {(error || success) && (
                        <div className={`${typeof error !== 'string' || error.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} border-l-4 p-4 rounded`} role="alert">
                            <p className="font-semibold">{typeof error !== 'string' || error.includes('Error') ? 'Error' : 'Success'}</p>
                            <p className="text-sm">{error || success}</p>
                        </div>
                    )}

                    {/* Registration Fields (Only show if not verifying) */}
                    {!isAwaitingVerification && (
                        <>
                            {/* Name Input */}
                            <div className="relative"> <User className="input-icon" /> <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className={inputClasses} disabled={isLoading}/> </div>
                            {/* Email Input */}
                            <div className="relative"> <Mail className="input-icon" /> <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className={inputClasses} disabled={isLoading}/> </div>
                            {/* Password Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative"> <Lock className="input-icon" /> <input type="password" name="password" placeholder="Password (min. 8)" value={formData.password} onChange={handleChange} required className={inputClasses} disabled={isLoading}/> </div>
                                <div className="relative"> <Lock className="input-icon" /> <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className={inputClasses} disabled={isLoading}/> </div>
                            </div>
                        </>
                    )}

                    {/* Verification Field (Only show if verifying) */}
                    {isAwaitingVerification && (
                         <div className="relative">
                            <Key className="input-icon" />
                            <input type="text" name="verificationCode" placeholder="6-Digit Code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} required className={`${inputClasses} text-center text-2xl tracking-widest`} maxLength={6} autoFocus disabled={isLoading}/>
                         </div>
                    )}

                    {/* Submit Button */}
                    <button type="submit" disabled={isLoading} className="submit-button">
                        {isLoading ? (<LoaderIcon className="w-5 h-5 mr-2 animate-spin" />) : isAwaitingVerification ? (<CheckCheck className="w-5 h-5 mr-2" />) : (<Send className="w-5 h-5 mr-2" />)}
                        {isLoading ? 'Processing...' : isAwaitingVerification ? 'Verify & Create' : 'Send Code'}
                    </button>

                    {/* Resend / Re-enter Options */}
                    {isAwaitingVerification && (
                        <div className="flex justify-between items-center text-sm pt-2">
                            <button type="button" onClick={handleResendCode} disabled={isLoading} className="link-button"> <RotateCcw className="w-4 h-4 mr-1" /> Resend Code </button>
                            <button type="button" onClick={handleReenterDetails} disabled={isLoading} className="link-button text-gray-500"> <Edit className="w-4 h-4 mr-1" /> Edit Details </button>
                        </div>
                    )}

                    {/* Login Link */}
                    <div className="text-center pt-4 text-sm text-gray-600 dark:text-gray-300">
                        Already have account?{' '} <Link to="/login" className="link"> Sign In </Link>
                    </div>
                </form>
            </div>
            {/* Minimal CSS for icons and links */}
            <style jsx>{`
                .input-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1.25rem; height: 1.25rem; color: #9ca3af; }
                .submit-button { width: 100%; display: flex; align-items: center; justify-content: center; padding: 0.75rem 1rem; background-color: #4f46e5; color: white; font-weight: 600; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); transition: background-color 0.3s; }
                .submit-button:hover { background-color: #4338ca; }
                .submit-button:disabled { opacity: 0.5; cursor: not-allowed; }
                .link-button { display: flex; align-items: center; background: none; border: none; cursor: pointer; color: #4f46e5; transition: color 0.2s; font-size: 0.875rem; line-height: 1.25rem; }
                .link-button:hover { text-decoration: underline; }
                .link-button:disabled { color: #9ca3af; cursor: not-allowed; }
                .link { color: #4f46e5; font-weight: 500; transition: color 0.2s; }
                .link:hover { text-decoration: underline; color: #4338ca; }
            `}</style>
        </div>
    );
};

export default Register;