import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  User,
  ChevronRight,
  ClipboardList,
  UserPlus,
  X,
  Zap,
} from "lucide-react";

const Sidebar = ({ logout, onClose }) => {
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
    // Admin-only items
    ...(role === "admin"
      ? [{ to: "/admin-panel", icon: UserPlus, label: "User Management" }]
      : []),
  ];

  // Role colors - enhanced gradients
  const roleConfig = {
    admin: {
      gradient: "from-violet-600 via-purple-600 to-indigo-600",
      accent: "purple",
      title: "Admin Panel",
      badge: "bg-gradient-to-r from-violet-500 to-purple-500",
      glow: "shadow-purple-500/20",
    },
    teacher: {
      gradient: "from-emerald-600 via-teal-600 to-cyan-600",
      accent: "emerald",
      title: "Teacher Panel",
      badge: "bg-gradient-to-r from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/20",
    },
    student: {
      gradient: "from-indigo-600 via-blue-600 to-cyan-600",
      accent: "indigo",
      title: "Student Panel",
      badge: "bg-gradient-to-r from-indigo-500 to-blue-500",
      glow: "shadow-indigo-500/20",
    },
  };

  const config = roleConfig[role] || roleConfig.student;

  const sidebarVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const itemVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="w-72 bg-white dark:bg-gray-950 border-r border-gray-200/80 dark:border-gray-800/50 h-screen flex flex-col shadow-xl"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* HEADER - Fixed */}
      <div className={`p-5 bg-gradient-to-br ${config.gradient} flex-shrink-0 flex items-center justify-between relative overflow-hidden`}>
        {/* Subtle mesh overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />
        
        <div className="flex items-center gap-3 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center bg-white/95 backdrop-blur p-1.5 shadow-lg"
          >
            <img src="/logo.png" alt="EduTrack Logo" className="w-full h-full object-cover rounded-lg" />
          </motion.div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              EduTrack
            </h2>
            <p className="text-white/70 text-xs font-medium tracking-wide">{config.title}</p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden text-white/70 hover:text-white p-1 -mr-2 relative z-10 transition-colors duration-200">
          <X size={22} />
        </button>
      </div>

      {/* USER CARD - Fixed */}
      <div className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800/50 flex-shrink-0">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800/50"
        >
          <div className={`w-9 h-9 rounded-lg ${config.badge} flex items-center justify-center text-white font-bold text-sm shadow-md ${config.glow}`}>
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {user?.name || "User"}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
              {user?.email || "user@edutrack.com"}
            </p>
          </div>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${config.badge} text-white capitalize tracking-wide`}>
            {role}
          </span>
        </motion.div>
      </div>

      {/* NAVIGATION - Scrollable */}
      <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-2.5">
          Navigation
        </p>

        {navItems.map((item, index) => (
          <motion.div
            key={item.to}
            custom={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <NavLink
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-medium transition-all duration-300 ${isActive
                  ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg ${config.glow}`
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={18}
                    className={`transition-colors duration-200 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`}
                  />
                  <span className="flex-1 tracking-wide">{item.label}</span>
                  <ChevronRight
                    size={14}
                    className={`transition-all duration-300 ${isActive ? "text-white/70" : "text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"}`}
                  />
                </>
              )}
            </NavLink>
          </motion.div>
        ))}

        {/* DIVIDER */}
        <div className="border-t border-gray-100 dark:border-gray-800/50 my-3" />

        <p className="px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-2.5">
          Account
        </p>

        {/* Settings */}
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3.5 py-3 rounded-xl text-[13px] font-medium transition-all duration-300 ${isActive
              ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg ${config.glow}`
              : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings size={18} className={`transition-colors duration-200 ${isActive ? "text-white" : "text-gray-400"}`} />
              <span className="flex-1 tracking-wide">Settings</span>
              <ChevronRight size={14} className="text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </NavLink>
      </nav>

      {/* LOGOUT & FOOTER - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-gray-100 dark:border-gray-800/50 bg-white dark:bg-gray-950">
        <div className="p-3.5">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium text-[13px] transition-all duration-300 border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </motion.button>
        </div>

        {/* FOOTER */}
        <div className="px-4 pb-4">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 font-medium flex items-center justify-center gap-1">
              <Zap size={10} className="text-indigo-400" />
              EduTrack v2.0
            </p>
            <p className="text-[10px] text-gray-400/60 mt-0.5">© {new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
