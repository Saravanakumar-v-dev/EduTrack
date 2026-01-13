import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

/*
|--------------------------------------------------------------------------
| NotFound Page (404)
|--------------------------------------------------------------------------
| Displayed when user navigates to an invalid route
|--------------------------------------------------------------------------
*/

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 max-w-md text-center"
      >
        {/* 404 TEXT */}
        <h1 className="text-7xl font-extrabold text-indigo-600 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          Page Not Found
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Sorry, the page you’re looking for doesn’t exist or has
          been moved.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
