import React, { useState, useContext, useCallback } from "react";
import {
  Mail,
  Lock,
  Loader as LoaderIcon,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import authService from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

import { toast } from "react-hot-toast";

/* 🔁 Slide Animation (Login → Register) */
const slideVariants = {
  initial: { x: -400, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: "easeInOut" },
  },
  exit: {
    x: 400,
    opacity: 0,
    transition: { duration: 0.45, ease: "easeInOut" },
  },
};

const Login = () => {
  /* ---------------- STATE ---------------- */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- CONTEXT ---------------- */
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ---------------- HANDLER ---------------- */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!email || !password) {
        toast.error("Email and password are required.");
        return;
      }

      setIsLoading(true);

      try {
        const response = await authService.loginUser({
          email,
          password,
        });

        /* 🔐 TWO-FACTOR AUTH FLOW */
        if (response.requires2FA) {
          toast.success("OTP sent to your email");
          navigate("/verify-otp", {
            state: {
              email,
              tempToken: response.tempToken,
            },
          });
          return;
        }

        /* ✅ NORMAL LOGIN */
        login(response);
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            err.message ||
            "Login failed"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, login, navigate]
  );

  /* ---------------- STYLES ---------------- */
  const inputClasses =
    "w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition";

  /* ---------------- JSX ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 overflow-hidden">
      <motion.div
        variants={slideVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-8 bg-indigo-600 text-white text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-indigo-200">
            Sign in to continue
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* EMAIL */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email Address"
              className={inputClasses}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className={inputClasses}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
          >
            {isLoading ? (
              <LoaderIcon className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {/* FOOTER */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-indigo-600 hover:underline font-medium"
            >
              Register
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
