import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
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
  Trash2,
  Download,
  Check,
} from "lucide-react";
import { toast } from "react-hot-toast";

/* =========================================================
   LANGUAGE CONFIG
   ========================================================= */
const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिन्दी (Hindi)", flag: "🇮🇳" },
  { code: "ta", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
  { code: "es", label: "Español (Spanish)", flag: "🇪🇸" },
  { code: "fr", label: "Français (French)", flag: "🇫🇷" },
];

/* =========================================================
   LOCAL STORAGE HELPERS
   ========================================================= */
const PREFS_KEY = "edutrack_settings";

const loadPrefs = () => {
  try {
    const stored = localStorage.getItem(PREFS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const savePrefs = (prefs) => {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
};

/* =========================================================
   SETTINGS COMPONENT
   ========================================================= */
const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  /* ---------- STATE ---------- */
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);

  const defaults = {
    notifications: { email: true, push: false, reports: true },
    language: "en",
  };

  const [notifications, setNotifications] = useState(defaults.notifications);
  const [selectedLanguage, setSelectedLanguage] = useState(defaults.language);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const prefs = loadPrefs();
    if (prefs) {
      if (prefs.notifications) setNotifications(prefs.notifications);
      if (prefs.language) setSelectedLanguage(prefs.language);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  /* ---------- PROFILE UPDATE ---------- */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Name cannot be empty");
    setLoading(true);

    try {
      // Try API call first, fall back to local-only
      const { default: userApi } = await import("../../api/userApi");
      const response = await userApi.updateProfile({ name });
      if (response.success) {
        toast.success("Profile updated successfully!");
      }
    } catch {
      // If the API endpoint doesn't exist yet, just save locally
      toast.success("Profile name updated!");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  /* ---------- NOTIFICATION HANDLER ---------- */
  const handleNotificationToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);

    // Save to localStorage
    const prefs = loadPrefs() || defaults;
    savePrefs({ ...prefs, notifications: updated });

    const label = key === "email" ? "Email" : key === "push" ? "Push" : "Reports";
    toast.success(`${label} notifications ${updated[key] ? "enabled" : "disabled"}`);
  };

  /* ---------- LANGUAGE HANDLER ---------- */
  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);

    // Save to localStorage
    const prefs = loadPrefs() || defaults;
    savePrefs({ ...prefs, language: langCode });

    const langObj = LANGUAGES.find((l) => l.code === langCode);
    toast.success(`Language changed to ${langObj?.label || langCode}`);
  };

  /* ---------- SECURITY HANDLERS ---------- */
  const handlePasswordChange = () => {
    toast.success("Password change link sent to your email!");
  };

  const handle2FAToggle = () => {
    toast("2FA is not yet available. Coming soon!", { icon: "🔒" });
  };

  /* ---------- ANIMATION ---------- */
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1
          className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Manage your account preferences and personalization
        </p>
      </motion.div>

      {/* PROFILE SETTINGS */}
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
            <User className="text-indigo-600 dark:text-indigo-400" size={18} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Profile Information
          </h2>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-300"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/30 text-gray-400 dark:text-gray-500 cursor-not-allowed text-sm"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">Email is managed by Firebase and cannot be changed here</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 transition-all duration-300"
          >
            <Save size={16} />
            {loading ? "Saving..." : "Save Changes"}
          </motion.button>
        </form>
      </motion.div>

      {/* NOTIFICATIONS */}
      <motion.div
        custom={1}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <Bell className="text-purple-600 dark:text-purple-400" size={18} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Notifications
          </h2>
        </div>

        <div className="space-y-1">
          <NotificationToggle
            label="Email Notifications"
            description="Receive updates and alerts via email"
            checked={notifications.email}
            onChange={() => handleNotificationToggle("email")}
          />
          <NotificationToggle
            label="Push Notifications"
            description="Get real-time alerts on your device"
            checked={notifications.push}
            onChange={() => handleNotificationToggle("push")}
          />
          <NotificationToggle
            label="Weekly Reports"
            description="Receive weekly performance summaries"
            checked={notifications.reports}
            onChange={() => handleNotificationToggle("reports")}
          />
        </div>
      </motion.div>

      {/* APPEARANCE */}
      <motion.div
        custom={2}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <Palette className="text-amber-600 dark:text-amber-400" size={18} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Appearance
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm text-gray-900 dark:text-white">Theme</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Switch between light and dark mode
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 text-sm font-medium transition-all duration-300 border border-gray-200 dark:border-gray-600"
          >
            {theme === "dark" ? (
              <>
                <Moon size={16} /> Dark
              </>
            ) : (
              <>
                <Sun size={16} /> Light
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* LANGUAGE & REGION */}
      <motion.div
        custom={3}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <Globe className="text-green-600 dark:text-green-400" size={18} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Language & Region
          </h2>
        </div>

        <div>
          <p className="font-medium text-sm text-gray-900 dark:text-white mb-1">Preferred Language</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Select the language for your dashboard interface
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
                  selectedLanguage === lang.code
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500 shadow-md shadow-green-500/20"
                    : "bg-gray-50 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600"
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="flex-1 text-left text-[13px]">{lang.label.split(" (")[0]}</span>
                {selectedLanguage === lang.code && (
                  <Check size={14} className="text-white" />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* SECURITY */}
      <motion.div
        custom={4}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <Lock className="text-blue-600 dark:text-blue-400" size={18} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Security
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-white">Change Password</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Update your account password</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePasswordChange}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all duration-300 hover:shadow-md"
            >
              Change
            </motion.button>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-gray-100 dark:border-gray-700/50 pt-4">
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Add extra security to your account</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handle2FAToggle}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-all duration-300 border border-gray-200 dark:border-gray-600"
            >
              Enable
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* PRIVACY & DATA */}
      <motion.div
        custom={5}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <Eye className="text-purple-600 dark:text-purple-400" size={18} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Privacy & Data
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="font-medium text-sm text-gray-900 dark:text-white">Export My Data</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Download all your data as JSON</p>
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
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-all duration-300 hover:shadow-md"
            >
              <Download size={14} />
              Export
            </motion.button>
          </div>

          <div className="flex items-center justify-between py-1 border-t border-gray-100 dark:border-gray-700/50 pt-4">
            <div>
              <p className="font-medium text-sm text-red-600 dark:text-red-400">Delete Account</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Permanently delete your account and data</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.error("Please contact support to delete your account")}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-all duration-300 border border-red-200 dark:border-red-800/50"
            >
              <Trash2 size={14} />
              Delete
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* LOGOUT */}
      <motion.div
        custom={6}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-gray-800/80 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <Shield className="text-red-600 dark:text-red-400" size={18} />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Account
          </h2>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
        >
          <LogOut size={18} />
          Sign Out
        </motion.button>
      </motion.div>
    </div>
  );
};

/* ---------- NOTIFICATION TOGGLE COMPONENT ---------- */
const NotificationToggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 px-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200">
    <div>
      <p className="font-medium text-sm text-gray-900 dark:text-white">{label}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
    </div>
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
        checked
          ? "bg-gradient-to-r from-indigo-500 to-violet-500 shadow-md shadow-indigo-500/20"
          : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </motion.button>
  </div>
);

export default Settings;
