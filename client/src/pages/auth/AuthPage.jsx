import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, ArrowLeft, Eye, EyeOff, Shield } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";
import { toast } from "react-hot-toast";
import { signInWithEmail, getFirebaseIdToken } from "../../config/firebase";

const AuthPage = () => {
  const { refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loginData, setLoginData] = useState({
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

    if (!loginData.email || !loginData.password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    try {
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
      await redirectToDashboard();
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : err.code === "auth/user-not-found"
            ? "No account found with this email"
            : err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Floating particles for background
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        padding: "clamp(1rem, 5vw, 2rem)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', 'Outfit', sans-serif",
      }}
    >
      {/* Animated background particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(16, 185, 129, 0.2))",
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Mesh gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 50% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "26rem",
          zIndex: 1,
        }}
      >
        {/* Back to School Site Link */}
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ x: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            padding: "0.625rem 1rem",
            background: "rgba(255, 255, 255, 0.07)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "0.75rem",
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "0.8125rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            letterSpacing: "0.01em",
          }}
        >
          <ArrowLeft size={16} />
          Back to School Site
        </motion.button>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            borderRadius: "1.5rem",
            boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
            padding: "clamp(2rem, 5vw, 2.75rem)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle glow effect at top */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), rgba(16, 185, 129, 0.5), transparent)",
            }}
          />

          {/* Logo/Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              style={{
                width: "72px",
                height: "72px",
                margin: "0 auto 1.25rem",
                borderRadius: "1.25rem",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.2))",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "10px",
              }}
            >
              <img src="/logo.png" alt="EduTrack Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{
                fontSize: "clamp(1.5rem, 4vw, 1.875rem)",
                fontWeight: 700,
                background: "linear-gradient(135deg, #c7d2fe, #a5b4fc, #6ee7b7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.375rem",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome Back
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{
                fontSize: "0.875rem",
                color: "rgba(255, 255, 255, 0.5)",
                letterSpacing: "0.01em",
              }}
            >
              Sign in to access EduTrack
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
              gap: "1.125rem",
            }}
          >
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.6)",
                  marginBottom: "0.375rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={18}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: focusedField === "email" ? "#818cf8" : "rgba(255, 255, 255, 0.3)",
                    transition: "color 0.3s ease",
                  }}
                />
                <input
                  id="email"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="your.email@example.com"
                  required
                  style={{
                    width: "100%",
                    padding: "0.8125rem 1rem 0.8125rem 2.75rem",
                    fontSize: "0.9375rem",
                    border: `1.5px solid ${focusedField === "email" ? "rgba(99, 102, 241, 0.5)" : "rgba(255, 255, 255, 0.08)"}`,
                    borderRadius: "0.875rem",
                    outline: "none",
                    transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    color: "white",
                    boxShadow: focusedField === "email" ? "0 0 0 3px rgba(99, 102, 241, 0.1), inset 0 0 0 1px rgba(99, 102, 241, 0.1)" : "none",
                    letterSpacing: "0.01em",
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
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.6)",
                  marginBottom: "0.375rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: focusedField === "password" ? "#818cf8" : "rgba(255, 255, 255, 0.3)",
                    transition: "color 0.3s ease",
                  }}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: "100%",
                    padding: "0.8125rem 3rem 0.8125rem 2.75rem",
                    fontSize: "0.9375rem",
                    border: `1.5px solid ${focusedField === "password" ? "rgba(99, 102, 241, 0.5)" : "rgba(255, 255, 255, 0.08)"}`,
                    borderRadius: "0.875rem",
                    outline: "none",
                    transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                    backgroundColor: "rgba(255, 255, 255, 0.04)",
                    color: "white",
                    boxShadow: focusedField === "password" ? "0 0 0 3px rgba(99, 102, 241, 0.1), inset 0 0 0 1px rgba(99, 102, 241, 0.1)" : "none",
                    letterSpacing: "0.05em",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255, 255, 255, 0.4)",
                    padding: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)")}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div style={{ textAlign: "right" }}>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                style={{
                  fontSize: "0.8125rem",
                  color: "rgba(165, 180, 252, 0.8)",
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "color 0.3s ease",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a5b4fc")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(165, 180, 252, 0.8)")}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.015, boxShadow: "0 10px 40px -10px rgba(99, 102, 241, 0.5)" }}
              whileTap={{ scale: loading ? 1 : 0.985 }}
              style={{
                width: "100%",
                padding: "0.9375rem",
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "white",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
                backgroundSize: "200% 200%",
                border: "none",
                borderRadius: "0.875rem",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 8px 30px -5px rgba(99, 102, 241, 0.4)",
                transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                letterSpacing: "0.02em",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Button shimmer */}
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "50%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                  pointerEvents: "none",
                }}
              />
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In to EduTrack"
              )}
            </motion.button>
          </motion.form>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{
              marginTop: "1.75rem",
              padding: "0.875rem",
              background: "rgba(255, 255, 255, 0.03)",
              borderRadius: "0.75rem",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <Shield size={14} style={{ color: "rgba(110, 231, 183, 0.7)" }} />
            <p
              style={{
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.4)",
                textAlign: "center",
                margin: 0,
                letterSpacing: "0.01em",
              }}
            >
              Secured by Firebase Authentication
            </p>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.75rem",
            color: "rgba(255, 255, 255, 0.3)",
            letterSpacing: "0.02em",
          }}
        >
          © {new Date().getFullYear()} EduTrack School. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
