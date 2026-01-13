// client/src/api/userApi.js
// Shared API service for user-related operations (all roles)
import axios from "./axios";

const userApi = {
    // ============ PROFILE ============

    /**
     * Update user profile information
     * @param {Object} data - { name, phone, bio, etc. }
     */
    updateProfile: async (data) => {
        const response = await axios.put("/users/profile", data);
        return response.data;
    },

    /**
     * Get current user profile
     */
    getProfile: async () => {
        const response = await axios.get("/users/profile");
        return response.data;
    },

    // ============ SECURITY ============

    /**
     * Change password
     * @param {Object} data - { currentPassword, newPassword }
     */
    changePassword: async (data) => {
        const response = await axios.put("/users/password", data);
        return response.data;
    },

    /**
     * Enable/Disable Two-Factor Authentication
     * @param {boolean} enable - true to enable, false to disable
     */
    toggle2FA: async (enable) => {
        const response = await axios.post("/users/2fa", { enable });
        return response.data;
    },

    // ============ PREFERENCES ============

    /**
     * Update user preferences (notifications, language, etc.)
     * @param {Object} preferences - { notifications, language, theme, etc. }
     */
    updatePreferences: async (preferences) => {
        const response = await axios.put("/users/preferences", preferences);
        return response.data;
    },

    /**
     * Get user preferences
     */
    getPreferences: async () => {
        const response = await axios.get("/users/preferences");
        return response.data;
    },

    // ============ NOTIFICATIONS ============

    /**
     * Update notification settings
     * @param {Object} settings - { email, push, reports }
     */
    updateNotifications: async (settings) => {
        const response = await axios.put("/users/notifications", settings);
        return response.data;
    },

    // ============ DATA MANAGEMENT ============

    /**
     * Export user data
     */
    exportData: async () => {
        const response = await axios.get("/users/export");
        return response.data;
    },

    /**
     * Delete user account
     * @param {string} password - User password for confirmation
     */
    deleteAccount: async (password) => {
        const response = await axios.delete("/users/account", { data: { password } });
        return response.data;
    },
};

export default userApi;
