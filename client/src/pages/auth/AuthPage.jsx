import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowLeft, GraduationCap } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import { toast } from "react-hot-toast";
import { signInWithEmail, registerWithEmail, getFirebaseIdToken } from "../../config/firebase";

const AuthPage = () => {
  const { refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* =====================================================
     REDIRECT TO DASHBOARD
  ===================================================== */
  const redirectToDashboard = async () => {
    await refreshUser();
    navigate("/dashboard");
  };

  /* =====================================================
     LOGIN HANDLER
  ===================================================== */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (isRegister && !loginData.name) {
      toast.error("Name is required for registration");
      return;
    }
    if (!loginData.email || !loginData.password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        // Firebase Email Register
        const firebaseUser = await registerWithEmail(loginData.email, loginData.password);
        const idToken = await getFirebaseIdToken();

        // Register with backend (the backend hack will force role="admin")
        await authService.registerWithFirebase({
          name: loginData.name,
          email: loginData.email,
          password: loginData.password,
          firebaseUid: firebaseUser.uid,
          idToken,
        });
        toast.success("Admin Account created successfully!");
      } else {
        // Firebase Email Sign-in
        const firebaseUser = await signInWithEmail(loginData.email, loginData.password);
        const idToken = await getFirebaseIdToken();

        // Authenticate with backend
        await authService.loginWithFirebase({
          email: loginData.email,
          firebaseUid: firebaseUser.uid,
          idToken,
        });
        toast.success("Logged in successfully!");
      }

      await redirectToDashboard();
    } catch (err) {
      console.error("Auth error:", err);
      const errorMessage =
        err.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : err.code === "auth/user-not-found"
            ? "No account found with this email"
            : err.code === "auth/email-already-in-use"
              ? "Email already registered"
              : err.response?.data?.message || "Authentication failed";
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
        {/* Back to School Site Link */}
        <motion.button
          onClick={() => navigate("/")}
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
          Back to School Site
        </motion.button>

        {/* Login Card */}
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
          {/* Logo/Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 1rem",
                borderRadius: "1rem",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                padding: "8px"
              }}
            >
              <img src="/logo.png" alt="EduTrack Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                fontWeight: 800,
                background: "linear-gradient(135deg, #4F46E5, #10B981)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.5rem",
              }}
            >
              {isRegister ? "Create Master Admin" : "Welcome Back"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                fontSize: "clamp(0.875rem, 2vw, 1rem)",
                color: "#6B7280",
              }}
            >
              {isRegister ? "Sign up to access EduTrack as Admin" : "Sign in to access EduTrack"}
            </motion.p>
          </div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleLogin}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* Name Input (Register Only) */}
            {isRegister && (
              <div>
                <label
                  htmlFor="name"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="name"
                    type="text"
                    value={loginData.name}
                    onChange={(e) => setLoginData({ ...loginData, name: e.target.value })}
                    placeholder="Your Full Name"
                    required={isRegister}
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem 0.875rem 1rem",
                      fontSize: "1rem",
                      border: "2px solid #E5E7EB",
                      borderRadius: "0.75rem",
                      outline: "none",
                      transition: "all 0.3s ease",
                      backgroundColor: "white",
                      color: "#111827",
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
            )}

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
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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
                    color: "#111827",
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

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
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
                  id="password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Enter your password"
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
                    color: "#111827",
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

            {/* Forgot Password / Toggle Register Link */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                style={{
                  fontSize: "0.875rem",
                  color: "#6B7280",
                  fontWeight: 600,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {isRegister ? "Already have an account? Sign in" : "Need an admin account? Register"}
              </button>
              
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  style={{
                    fontSize: "0.875rem",
                    color: "#4F46E5",
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Forgot password?
                </button>
              )}
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
                  {isRegister ? "Registering..." : "Signing In..."}
                </>
              ) : (
                isRegister ? "Create Admin Account" : "Sign In to EduTrack"
              )}
            </motion.button>
          </motion.form>

          {/* Footer Info */}
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
              🔐 Secure login powered by Firebase Authentication
            </p>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: "2rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          © {new Date().getFullYear()} EduTrack School. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
