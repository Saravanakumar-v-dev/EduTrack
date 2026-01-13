import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  User,
  ChevronRight,
  Sparkles,
  ClipboardList,
} from "lucide-react";

const Sidebar = ({ logout }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || "student";

  // Navigation items
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/reports", icon: FileText, label: "Reports" },
    { to: "/assignments", icon: ClipboardList, label: "Assignments" },
    { to: "/profile", icon: User, label: "My Profile" },
  ];

  // Role colors
  const roleConfig = {
    admin: {
      gradient: "from-purple-600 to-indigo-600",
      accent: "purple",
      title: "Admin Panel",
      badge: "bg-purple-500",
    },
    teacher: {
      gradient: "from-emerald-600 to-teal-600",
      accent: "emerald",
      title: "Teacher Panel",
      badge: "bg-emerald-500",
    },
    student: {
      gradient: "from-indigo-600 to-blue-600",
      accent: "indigo",
      title: "Student Panel",
      badge: "bg-indigo-500",
    },
  };

  const config = roleConfig[role] || roleConfig.student;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen hidden md:flex flex-col shadow-xl sticky top-0"
    >
      {/* HEADER - Fixed */}
      <div className={`p-6 bg-gradient-to-br ${config.gradient} flex-shrink-0`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">EduTrack</h2>
            <p className="text-white/80 text-sm">{config.title}</p>
          </div>
        </div>
      </div>

      {/* USER CARD - Fixed */}
      <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div className={`w-10 h-10 rounded-xl ${config.badge} flex items-center justify-center text-white font-bold text-lg`}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || "user@edutrack.com"}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${config.badge} text-white capitalize`}>
            {role}
          </span>
        </div>
      </div>

      {/* NAVIGATION - Scrollable */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Navigation
        </p>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg shadow-${config.accent}-500/25`
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}
                />
                <span className="flex-1">{item.label}</span>
                <ChevronRight
                  size={16}
                  className={`transition-transform ${isActive ? "text-white/80" : "text-gray-300 group-hover:translate-x-1"}`}
                />
              </>
            )}
          </NavLink>
        ))}

        {/* DIVIDER */}
        <div className="border-t border-gray-200 dark:border-gray-800 my-4" />

        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Account
        </p>

        {/* Settings */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `group flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
              ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings size={20} className={isActive ? "text-white" : "text-gray-400"} />
              <span className="flex-1">Settings</span>
              <ChevronRight size={16} className="text-gray-300" />
            </>
          )}
        </NavLink>
      </nav>

      {/* LOGOUT & FOOTER - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="p-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-all duration-200"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </motion.button>
        </div>

        {/* FOOTER */}
        <div className="p-4 pt-0">
          <div className="text-center">
            <p className="text-xs text-gray-400">EduTrack v1.0</p>
            <p className="text-xs text-gray-400 mt-1">© 2024 All rights reserved</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
