import React, { useState, useContext } from "react";
import {
  User,
  Mail,
  Lock,
  Loader as LoaderIcon,
  Send,
  CheckCheck,
  RotateCcw,
  Edit,
  Key,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import authService from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";

import { toast } from "react-hot-toast";

/* 🔁 Slide Animation (Register → Login) */
const slideVariants = {
  initial: { x: 400, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: "easeInOut" },
  },
  exit: {
    x: -400,
    opacity: 0,
    transition: { duration: 0.45, ease: "easeInOut" },
  },
};

const Register = () => {
  /* ---------------- STATE ---------------- */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [isAwaitingVerification, setIsAwaitingVerification] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* ---------------- CONTEXT ---------------- */
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReenterDetails = () => {
    setIsAwaitingVerification(false);
    setVerificationCode("");
  };

  /* -------- STEP 1: REQUEST OTP -------- */
  const handleRequestOtpSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } =
      formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.requestRegisterOtp({
        name,
        email,
        role: "student",
      });

      toast.success("Verification code sent to email.");
      setIsAwaitingVerification(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to send verification code."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* -------- STEP 2: VERIFY OTP -------- */
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();

    if (verificationCode.length !== 6) {
      toast.error("Enter the 6-digit verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const userData =
        await authService.verifyRegisterOtp({
          ...formData,
          otp: verificationCode,
          role: "student",
        });

      toast.success("Account created successfully!");
      login(userData);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Verification failed. Code may be invalid."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* -------- RESEND CODE -------- */
  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      await authService.requestRegisterOtp({
        email: formData.email,
        role: "student",
      });
      toast.success("New code sent.");
    } catch (err) {
      toast.error("Failed to resend code.");
    } finally {
      setIsLoading(false);
    }
  };

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
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="p-8 bg-indigo-600 text-white text-center">
          <h1 className="text-3xl font-bold">
            {isAwaitingVerification
              ? "Verify Your Email"
              : "Create Account"}
          </h1>
          <p className="mt-2 text-indigo-200">
            {isAwaitingVerification
              ? `Enter the code sent to ${formData.email}`
              : "Sign up to get started"}
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={
            isAwaitingVerification
              ? handleVerifyOtpSubmit
              : handleRequestOtpSubmit
          }
          className="p-8 space-y-6"
        >
          {/* REGISTRATION FIELDS */}
          {!isAwaitingVerification && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className={inputClasses}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className={inputClasses}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 8 chars)"
                  className={inputClasses}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={inputClasses}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </>
          )}

          {/* OTP FIELD */}
          {isAwaitingVerification && (
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="6-Digit Code"
                className={`${inputClasses} text-center text-2xl tracking-widest`}
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                maxLength={6}
                disabled={isLoading}
                autoFocus
                required
              />
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
          >
            {isLoading ? (
              <LoaderIcon className="w-5 h-5 animate-spin" />
            ) : isAwaitingVerification ? (
              <CheckCheck className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            {isAwaitingVerification
              ? "Verify & Create"
              : "Send Verification Code"}
          </button>

          {/* OTP ACTIONS */}
          {isAwaitingVerification && (
            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-indigo-600 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                Resend Code
              </button>
              <button
                type="button"
                onClick={handleReenterDetails}
                disabled={isLoading}
                className="text-gray-500 hover:underline flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Edit Details
              </button>
            </div>
          )}

          {/* FOOTER */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign In
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
