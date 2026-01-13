// client/src/api/adminApi.js
// Admin API service for user management with MongoDB
import axios from "./axios";

const adminApi = {
    // ============ USERS ============

    /**
     * Get all users with pagination and filtering
     * @param {Object} params - { role, search, page, limit }
     */
    getAllUsers: async (params = {}) => {
        const response = await axios.get("/users", { params });
        return response.data;
    },

    /**
     * Get users by role (students or teachers)
     * @param {string} role - 'student' | 'teacher' | 'admin'
     */
    getUsersByRole: async (role, search = "", page = 1, limit = 50) => {
        const response = await axios.get("/users", {
            params: { role, search, page, limit }
        });
        return response.data;
    },

    /**
     * Get single user by ID
     */
    getUserById: async (id) => {
        const response = await axios.get(`/users/${id}`);
        return response.data;
    },

    /**
     * Create new user (student/teacher)
     */
    createUser: async (userData) => {
        const response = await axios.post("/users", userData);
        return response.data;
    },

    /**
     * Update user by ID
     */
    updateUser: async (id, userData) => {
        const response = await axios.put(`/users/${id}`, userData);
        return response.data;
    },

    /**
     * Delete user by ID
     */
    deleteUser: async (id) => {
        const response = await axios.delete(`/users/${id}`);
        return response.data;
    },

    // ============ REPORTS ============

    /**
     * Get all reports
     */
    getAllReports: async (params = {}) => {
        const response = await axios.get("/reports", { params });
        return response.data;
    },

    /**
     * Update a report
     */
    updateReport: async (id, reportData) => {
        const response = await axios.put(`/reports/${id}`, reportData);
        return response.data;
    },

    /**
     * Delete a report
     */
    deleteReport: async (id) => {
        const response = await axios.delete(`/reports/${id}`);
        return response.data;
    },

    // ============ ANALYTICS ============

    /**
     * Get admin dashboard stats
     */
    getDashboardStats: async () => {
        const response = await axios.get("/analytics/dashboard");
        return response.data;
    },

    // ============ GRADES / MARKS ============

    /**
     * Get all grades
     */
    getAllGrades: async (params = {}) => {
        const response = await axios.get("/grades", { params });
        return response.data;
    },

    /**
     * Update a grade
     */
    updateGrade: async (id, gradeData) => {
        const response = await axios.put(`/grades/${id}`, gradeData);
        return response.data;
    },

    /**
     * Delete a grade
     */
    deleteGrade: async (id) => {
        const response = await axios.delete(`/grades/${id}`);
        return response.data;
    },
};

export default adminApi;
