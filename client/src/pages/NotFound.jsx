import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-white">
      <motion.div
        className="text-center p-6 bg-white rounded-3xl shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-xl mb-6 text-gray-700">Oops! Page not found.</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
