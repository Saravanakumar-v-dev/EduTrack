import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 max-w-md text-center"
      >
        <ShieldAlert className="mx-auto w-14 h-14 text-red-600 mb-4" />

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Access Denied
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mb-8">
          You don’t have permission to access this page.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
