// client/src/components/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { FaSignOutAlt, FaChartLine, FaFileAlt, FaThLarge, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-md border-b border-gray-200 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* BRAND */}
        <Link
          to="/dashboard"
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
        >
          EduTrack+
        </Link>

        {/* MAIN NAVIGATION – visible always */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <FaThLarge /> Dashboard
          </Link>

          <Link
            to="/analytics"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <FaChartLine /> Analytics
          </Link>

          <Link
            to="/reports"
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            <FaFileAlt /> Reports
          </Link>

        </div>

        {/* RIGHT SIDE INFO */}
        <div className="flex items-center gap-6">

          {/* USER INFO */}
          <div className="hidden md:flex flex-col text-right">
            <p className="text-gray-900 dark:text-white font-semibold flex items-center gap-1">
              <FaUserCircle className="text-indigo-500" />
              {user?.name || "User"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>

          {/* SIGN OUT */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
          >
            <FaSignOutAlt /> Logout
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
