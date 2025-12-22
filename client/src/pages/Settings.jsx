import React, { useState, useContext, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Save, Loader as LoaderIcon, Bell, Palette, Key, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

// --- Theme Utility Functions (CRITICAL FIX) ---

/**
 * Determines the initial theme preference from localStorage or system settings.
 */
const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) return storedTheme;
  }
  // Default to system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'system';
    }
  }
  return 'light'; 
};

/**
 * Applies the theme class (dark or light) to the global HTML tag.
 */
const applyTheme = (theme) => {
  const root = document.documentElement;
  
  // Logic to determine if dark class should be applied
  const isDark = theme === 'dark' || 
                 (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Save the user's explicit preference to localStorage
  localStorage.setItem('theme', theme);
};


// --- Reusable Component Definitions (Unchanged) ---

const SettingsCard = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8"
  >
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
      <Icon className="w-5 h-5 mr-3 text-indigo-600" />
      {title}
    </h3>
    <div className="space-y-4">
      {children}
    </div>
  </motion.div>
);

const SettingsInput = ({ label, id, type, value, onChange, icon: Icon, disabled = false, autoComplete = 'off' }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 transition"
      />
    </div>
  </div>
);

// --- Main Settings Page Component ---

const Settings = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // State for theme: reads from local storage on mount
  const [theme, setTheme] = useState(getInitialTheme);

  // --- Synchronization Effect (CRITICAL FIX) ---
  // This effect runs once on mount to apply the stored theme, and whenever the theme state changes.
  useEffect(() => {
    applyTheme(theme);
    
    // Add event listener for system theme changes (if 'system' is selected)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
        // Only re-apply theme if the user selected 'system'
        if (theme === 'system') {
            applyTheme('system'); 
        }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);


  // --- Profile State ---
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // --- Password State ---
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle input changes (useCallback for performance)
  const handleProfileChange = useCallback((e) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);
  
  // --- Theme Change Handler (Updates state, which triggers useEffect) ---
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(`Theme set to ${newTheme}!`);
  };

  // --- Form Submit Handlers (Mocks) ---

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      // NOTE: Replace MOCK with actual authService.updateUserProfile(profileData);
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      // NOTE: Replace MOCK with authService.changePassword({...});
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (passwordData.currentPassword === 'wrong') {
        throw new Error('Current password does not match.');
      }
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (authLoading) {
    return <div className="p-8 text-center"><LoaderIcon className="w-6 h-6 animate-spin mx-auto text-indigo-600" /></div>;
  }

  if (!user) {
     return <div className="p-8 text-center text-red-500">Could not load user data.</div>;
  }

  // --- Tab Render Functions ---

  function renderProfileSettings() {
    return (
      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <SettingsInput
          label="Full Name" id="name" type="text" value={profileData.name} onChange={handleProfileChange}
          icon={User} disabled={profileLoading}
        />
        <SettingsInput
          label="Email Address" id="email" type="email" value={profileData.email} onChange={handleProfileChange}
          icon={Mail} disabled={true} // Email is usually immutable
        />
        <div className="pt-2">
          <button
            type="submit" disabled={profileLoading} className="btn-primary w-full md:w-auto flex items-center justify-center disabled:opacity-50"
          >
            {profileLoading ? (<LoaderIcon className="w-5 h-5 mr-2 animate-spin" />) : (<Save className="w-5 h-5 mr-2" />)}
            {profileLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    );
  }

  function renderSecuritySettings() {
    return (
      <>
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mt-4">Password Management</h4>
        <form onSubmit={handlePasswordSubmit} className="space-y-4 border-b border-gray-100 dark:border-gray-700 pb-6">
          <SettingsInput
            label="Current Password" id="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange}
            icon={Lock} disabled={passwordLoading} autoComplete="current-password"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SettingsInput
              label="New Password (Min 8 Chars)" id="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange}
              icon={Lock} disabled={passwordLoading} autoComplete="new-password"
            />
            <SettingsInput
              label="Confirm New Password" id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={handlePasswordChange}
              icon={Lock} disabled={passwordLoading} autoComplete="new-password"
            />
          </div>
          <div className="pt-2">
            <button
              type="submit" disabled={passwordLoading} className="btn-primary w-full md:w-auto flex items-center justify-center disabled:opacity-50"
            >
              {passwordLoading ? (<LoaderIcon className="w-5 h-5 mr-2 animate-spin" />) : (<Save className="w-5 h-5 mr-2" />)}
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>

        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <div className="pt-6 space-y-3">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">API Access</h4>
            <p className="text-sm text-gray-500">Your API key for external analytics tools.</p>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex justify-between items-center text-sm font-mono break-all">
                <code className="text-indigo-700 dark:text-indigo-300">ET-1A2B-C3D4-E5F6-G7H8</code>
                <button className="text-xs text-gray-500 hover:text-indigo-600 ml-4">Copy</button>
            </div>
          </div>
        )}
      </>
    );
  }

  function renderAppSettings() {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Theme Selection</h4>
            <p className="text-sm text-gray-500">Switch between light, dark, and system default.</p>
            <div className="flex space-x-4">
                {['light', 'dark', 'system'].map(t => (
                    <button
                        key={t}
                        onClick={() => handleThemeChange(t)}
                        className={`px-4 py-2 rounded-full text-sm capitalize transition-all border ${
                            theme === t 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>

        <div className="space-y-2">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h4>
            <p className="text-sm text-gray-500">Manage when you receive alerts.</p>
            <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                    <label htmlFor="emailNotif" className="text-gray-700 dark:text-gray-300">Email alerts for failing students</label>
                    <input type="checkbox" id="emailNotif" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700">
                    <label htmlFor="badgeNotif" className="text-gray-700 dark:text-gray-300">In-app notifications for earned badges</label>
                    <input type="checkbox" id="badgeNotif" defaultChecked={false} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- Tab Configuration ---
  const tabs = [
    { id: 'profile', name: 'Account & Profile', icon: User, content: renderProfileSettings() },
    { id: 'security', name: 'Security & Auth', icon: Shield, content: renderSecuritySettings() },
    { id: 'app', name: 'App Preferences', icon: Palette, content: renderAppSettings() },
  ];

  return (
    <div className="container mx-auto space-y-8 p-4 md:p-8">
      {/* Page Header */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold text-gray-900 dark:text-white"
      >
        Settings
      </motion.h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-5 h-5 mr-2" />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <SettingsCard title={tabs.find(t => t.id === activeTab).name} icon={tabs.find(t => t.id === activeTab).icon}>
            {tabs.find(t => t.id === activeTab).content}
          </SettingsCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Settings;