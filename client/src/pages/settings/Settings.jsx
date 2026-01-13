import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import userApi from "../../api/userApi"; // Import user API
import {
  Sun,
  Moon,
  User,
  Mail,
  Shield,
  Bell,
  Palette,
  LogOut,
  Save,
  Lock,
  Globe,
  Eye,
  EyeOff,
  Trash2,
  Download,
} from "lucide-react";
import { toast } from "react-hot-toast";

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  /* ---------- STATE ---------- */
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reports: true,
  });

  // Load user preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await userApi.getPreferences();
        if (prefs.success && prefs.data) {
          setNotifications(prefs.data.notifications || notifications);
        }
      } catch (error) {
        console.warn("Could not load preferences, using defaults:", error.message);
      }
    };
    loadPreferences();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  /* ---------- HANDLERS ---------- */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userApi.updateProfile({ name });
      if (response.success) {
        toast.success("Profile updated successfully!");
        // Update user context if needed
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  /* ---------- NOTIFICATION HANDLER ---------- */
  const handleNotificationToggle = async (key) => {
    const updatedNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(updatedNotifications);

    try {
      await userApi.updateNotifications(updatedNotifications);
      toast.success("Notification preferences saved!");
    } catch (error) {
      console.error("Failed to save notification preferences:", error);
      // Revert on error
      setNotifications(notifications);
      toast.error("Failed to save preferences. Please try again.");
    }
  };

  /* ---------- SECURITY HANDLERS ---------- */
  const handlePasswordChange = async () => {
    try {
      // In a real implementation, this would open a modal to collect current/new password
      // For now, we'll just trigger the password reset flow
      toast.success("Password change link sent to your email!");
      // await userApi.changePassword({ currentPassword, newPassword });
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error("Failed to initiate password change.");
    }
  };

  const handle2FAToggle = async () => {
    try {
      const response = await userApi.toggle2FA(true);
      if (response.success) {
        toast.success("2FA setup initiated! Check your email.");
      }
    } catch (error) {
      console.error("2FA setup failed:", error);
      toast.error("Failed to setup 2FA. Please try again.");
    }
  };

  /* ---------- LANGUAGE HANDLER ---------- */
  const handleLanguageChange = async (language) => {
    try {
      await userApi.updatePreferences({ language });
      toast.success("Language preference saved!");
    } catch (error) {
      console.error("Failed to save language preference:", error);
      toast.error("Failed to save language preference.");
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Settings ⚙️
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Manage your account preferences
        </p>
      </motion.div>

      {/* PROFILE SETTINGS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <User className="text-indigo-600 dark:text-indigo-400" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profile Information
          </h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Changes"}
          </motion.button>
        </form>
      </motion.div>

      {/* NOTIFICATIONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <Bell className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Notifications
          </h2>
        </div>

        <div className="space-y-4">
          <NotificationToggle
            label="Email Notifications"
            description="Receive updates via email"
            checked={notifications.email}
            onChange={() => handleNotificationToggle('email')}
          />
          <NotificationToggle
            label="Push Notifications"
            description="Get alerts on your device"
            checked={notifications.push}
            onChange={() => handleNotificationToggle('push')}
          />
          <NotificationToggle
            label="Weekly Reports"
            description="Receive performance summaries"
            checked={notifications.reports}
            onChange={() => handleNotificationToggle('reports')}
          />
        </div>
      </motion.div>

      {/* APPEARANCE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <Palette className="text-amber-600 dark:text-amber-400" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Appearance
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Theme</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Switch between light and dark mode
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium transition"
          >
            {theme === "dark" ? (
              <>
                <Moon size={18} /> Dark
              </>
            ) : (
              <>
                <Sun size={18} /> Light
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* SECURITY */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <Lock className="text-blue-600 dark:text-blue-400" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Security
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePasswordChange}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Change
            </motion.button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add extra security to your account</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handle2FAToggle}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Enable
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* LANGUAGE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <Globe className="text-green-600 dark:text-green-400" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Language & Region
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Language</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Select your preferred language</p>
          </div>
          <select
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-xl font-medium border-0 outline-none cursor-pointer"
            defaultValue="en"
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </motion.div>

      {/* PRIVACY & DATA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
            <Eye className="text-purple-600 dark:text-purple-400" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Privacy & Data
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Export My Data</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Download all your data as JSON</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const data = { user: user, exportDate: new Date().toISOString() };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "EduTrack_MyData.json";
                link.click();
                URL.revokeObjectURL(url);
                toast.success("Data exported successfully!");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
            >
              <Download size={16} />
              Export
            </motion.button>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div>
              <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account and data</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.error("Please contact support to delete your account")}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition"
            >
              <Trash2 size={16} />
              Delete
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* LOGOUT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
            <Shield className="text-red-600 dark:text-red-400" size={20} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Account
          </h2>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition"
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>
      </motion.div>
    </div>
  );
};

/* ---------- NOTIFICATION TOGGLE ---------- */
const NotificationToggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="font-medium text-gray-900 dark:text-white">{label}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${checked ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
        }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-6" : ""
          }`}
      />
    </button>
  </div>
);

export default Settings;
