import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { sendPasswordReset } from "../../config/firebase";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // Auto-redirect to login after email is sent
    useEffect(() => {
        if (emailSent && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (emailSent && countdown === 0) {
            navigate("/auth");
        }
    }, [emailSent, countdown, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        setLoading(true);

        try {
            // Use Firebase to send password reset email
            await sendPasswordReset(email);
            setEmailSent(true);
            toast.success("Password reset email sent!");
        } catch (error) {
            console.error("Password reset error:", error);
            const errorMessage =
                error.code === "auth/user-not-found"
                    ? "No account found with this email"
                    : error.code === "auth/invalid-email"
                        ? "Invalid email address"
                        : error.code === "auth/too-many-requests"
                            ? "Too many requests. Please try again later"
                            : "Failed to send reset email. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #10B981 100%)",
                backgroundSize: "400% 400%",
                animation: "gradientShift 15s ease infinite",
                padding: "clamp(1rem, 5vw, 2rem)",
            }}
        >
            {/* Background pattern */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.1,
                    backgroundImage:
                        "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)",
                    backgroundSize: "50px 50px",
                }}
            />

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "28rem",
                    zIndex: 1,
                }}
            >
                {/* Back to Login Button */}
                <motion.button
                    onClick={() => navigate("/auth")}
                    whileHover={{ x: -4 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "2rem",
                        padding: "0.75rem 1.25rem",
                        background: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "0.75rem",
                        color: "white",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                    }}
                >
                    <ArrowLeft size={18} />
                    Back to Login
                </motion.button>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(20px)",
                        borderRadius: "1.5rem",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        padding: "clamp(2rem, 5vw, 3rem)",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                    }}
                >
                    {/* Header Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        style={{
                            width: "64px",
                            height: "64px",
                            margin: "0 auto 1rem",
                            borderRadius: "1rem",
                            background: emailSent
                                ? "linear-gradient(135deg, #10B981, #059669)"
                                : "linear-gradient(135deg, #4F46E5, #6366F1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                        }}
                    >
                        {emailSent ? <CheckCircle size={36} /> : <Mail size={36} />}
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                            fontWeight: 800,
                            background: emailSent
                                ? "linear-gradient(135deg, #10B981, #059669)"
                                : "linear-gradient(135deg, #4F46E5, #6366F1)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            marginBottom: "0.5rem",
                            textAlign: "center",
                        }}
                    >
                        {emailSent ? "Check Your Email" : "Forgot Password?"}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            fontSize: "clamp(0.875rem, 2vw, 1rem)",
                            color: "#6B7280",
                            textAlign: "center",
                            marginBottom: "2rem",
                        }}
                    >
                        {emailSent
                            ? `We've sent a password reset link to your email. Redirecting to login in ${countdown}s...`
                            : "Enter your email address and we'll send you a link to reset your password."}
                    </motion.p>

                    {!emailSent ? (
                        /* Form */
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            onSubmit={handleSubmit}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1.25rem",
                            }}
                        >
                            {/* Email Input */}
                            <div>
                                <label
                                    htmlFor="email"
                                    style={{
                                        display: "block",
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                        color: "#374151",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    Email Address
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Mail
                                        size={20}
                                        style={{
                                            position: "absolute",
                                            left: "1rem",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#4F46E5",
                                        }}
                                    />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@example.com"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "0.875rem 1rem 0.875rem 3rem",
                                            fontSize: "1rem",
                                            border: "2px solid #E5E7EB",
                                            borderRadius: "0.75rem",
                                            outline: "none",
                                            transition: "all 0.3s ease",
                                            backgroundColor: "white",
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = "#4F46E5";
                                            e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.1)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = "#E5E7EB";
                                            e.target.style.boxShadow = "none";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                style={{
                                    width: "100%",
                                    padding: "1rem",
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    color: "white",
                                    background: "linear-gradient(135deg, #4F46E5, #6366F1)",
                                    border: "none",
                                    borderRadius: "0.75rem",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    opacity: loading ? 0.7 : 1,
                                    boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
                                    transition: "all 0.3s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.5rem",
                                }}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Mail size={20} />
                                        Send Reset Link
                                    </>
                                )}
                            </motion.button>
                        </motion.form>
                    ) : (
                        /* Success State */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}
                        >
                            {/* Email Display */}
                            <div
                                style={{
                                    padding: "1rem",
                                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))",
                                    borderRadius: "0.75rem",
                                    border: "1px solid rgba(16, 185, 129, 0.2)",
                                    textAlign: "center",
                                }}
                            >
                                <p style={{ fontSize: "0.875rem", color: "#374151", margin: 0 }}>
                                    Sent to: <strong>{email}</strong>
                                </p>
                            </div>

                            {/* Try Another Email Button */}
                            <button
                                onClick={() => {
                                    setEmailSent(false);
                                    setEmail("");
                                }}
                                style={{
                                    width: "100%",
                                    padding: "0.75rem 1rem",
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                    color: "#4F46E5",
                                    background: "transparent",
                                    border: "2px solid #4F46E5",
                                    borderRadius: "0.75rem",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Try a Different Email
                            </button>

                            {/* Back to Login Button */}
                            <button
                                onClick={() => navigate("/auth")}
                                style={{
                                    width: "100%",
                                    padding: "1rem",
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    color: "white",
                                    background: "linear-gradient(135deg, #10B981, #059669)",
                                    border: "none",
                                    borderRadius: "0.75rem",
                                    cursor: "pointer",
                                    boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.3)",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Back to Login
                            </button>
                        </motion.div>
                    )}

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        style={{
                            marginTop: "2rem",
                            padding: "1rem",
                            background: "linear-gradient(135deg, rgba(79, 70, 229, 0.05), rgba(16, 185, 129, 0.05))",
                            borderRadius: "0.75rem",
                            border: "1px solid rgba(79, 70, 229, 0.1)",
                        }}
                    >
                        <p
                            style={{
                                fontSize: "0.875rem",
                                color: "#6B7280",
                                textAlign: "center",
                                margin: 0,
                            }}
                        >
                            🔐 {emailSent ? "Check your spam folder if you don't see the email" : "Powered by Firebase Authentication"}
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
