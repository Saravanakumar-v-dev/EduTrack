import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, LogIn } from "lucide-react";

const SessionExpired = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 max-w-md text-center"
      >
        <Clock className="mx-auto w-14 h-14 text-indigo-600 mb-4" />

        <h1 className="text-3xl font-bold mb-2">
          Session Expired
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Your session has expired. Please log in again to continue.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-indigo-600 text-white rounded-xl"
        >
          <LogIn className="w-4 h-4" />
          Go to Login
        </button>
      </motion.div>
    </div>
  );
};

export default SessionExpired;
