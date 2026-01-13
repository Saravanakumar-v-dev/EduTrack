import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  LayoutDashboard,
  BarChart3,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
      {/* LEFT: BRAND */}
      <div className="flex items-center gap-2">
        <h1
          className="text-xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate("/student/dashboard")}
        >
          EduTrack
        </h1>
        <span className="text-xs text-gray-400">
          Student Portal
        </span>
      </div>

      {/* CENTER: QUICK NAV (STUDENT SAFE) */}
      <nav className="hidden md:flex items-center gap-6">
        <NavLink
          to="/student/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-1 text-sm font-medium ${isActive
              ? "text-indigo-600"
              : "text-gray-600 hover:text-indigo-600"
            }`
          }
        >
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>

        <NavLink
          to="/student/performance"
          className={({ isActive }) =>
            `flex items-center gap-1 text-sm font-medium ${isActive
              ? "text-indigo-600"
              : "text-gray-600 hover:text-indigo-600"
            }`
          }
        >
          <BarChart3 size={16} />
          Performance
        </NavLink>
      </nav>

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-4 relative">
        {/* Notifications */}
        <NotificationBell />

        {/* PROFILE */}
        <button
          onClick={() => setOpenProfile(!openProfile)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
            {user?.name?.charAt(0) || "S"}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {user?.name}
          </span>
        </button>

        {/* PROFILE DROPDOWN */}
        {openProfile && (
          <div className="absolute right-0 top-14 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-medium text-gray-800">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email}
              </p>
            </div>

            <NavLink
              to="/student/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setOpenProfile(false)}
            >
              <Settings size={16} />
              Settings
            </NavLink>

            <button
              onClick={() => {
                setOpenProfile(false);
                logout();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
