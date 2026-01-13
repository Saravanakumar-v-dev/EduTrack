// client/src/api/teacherApi.js
// Teacher API service for attendance, marks, and requests
import axios from "./axios";

const teacherApi = {
  // ============ ATTENDANCE ============

  /**
   * Mark attendance for multiple students
   * @param {Object} data - { date, students: [{ studentId, status }] }
   */
  markAttendance: async (data) => {
    const response = await axios.post("/attendance", data);
    return response.data;
  },

  /**
   * Get students assigned to teacher
   */
  getStudents: async (teacherId) => {
    const response = await axios.get("/students", {
      params: { assignedTeacher: teacherId }
    });
    return response.data;
  },

  /**
   * Get attendance records
   * @param {Object} params - { date, studentId }
   */
  getAttendance: async (params = {}) => {
    const response = await axios.get("/attendance", { params });
    return response.data;
  },

  // ============ MARKS ============

  /**
   * Add a single mark
   * @param {Object} markData - { student, subject, score, examType, ... }
   */
  addMark: async (markData) => {
    const response = await axios.post("/marks", markData);
    return response.data;
  },

  /**
   * Bulk upload marks
   * @param {Array} marks - Array of mark objects
   */
  bulkUploadMarks: async (marks) => {
    const response = await axios.post("/marks/bulk", { marks });
    return response.data;
  },

  /**
   * Get marks (teacher's own uploads)
   */
  getMarks: async () => {
    const response = await axios.get("/marks");
    return response.data;
  },

  // ============ REQUESTS ============

  /**
   * Create an admin request
   * @param {Object} requestData - { type, message }
   */
  createRequest: async (requestData) => {
    const response = await axios.post("/requests", requestData);
    return response.data;
  },

  /**
   * Get teacher's requests
   */
  getRequests: async () => {
    const response = await axios.get("/requests");
    return response.data;
  },
};

// Named exports for convenience
export const {
  markAttendance,
  getStudents,
  getAttendance,
  addMark,
  bulkUploadMarks,
  getMarks,
  createRequest,
  getRequests,
} = teacherApi;

export default teacherApi;
