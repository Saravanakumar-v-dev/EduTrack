import axios from "./axios";

/*
|--------------------------------------------------------------------------
| Analytics API Layer
|--------------------------------------------------------------------------
| Centralized API calls for:
| - Dashboard analytics
| - Reports
| - Student performance trends
| - Role-based analytics
|--------------------------------------------------------------------------
*/

/* ---------------- DASHBOARD ANALYTICS ---------------- */

/**
 * Get overall dashboard analytics
 * Admin: full stats
 * Teacher: class/subject stats
 * Student: personal stats
 */
export const getDashboardAnalytics = async () => {
  const { data } = await axios.get("/api/analytics/dashboard");
  return data;
};

/**
 * Get subject-wise performance analytics
 */
export const getSubjectAnalytics = async () => {
  const { data } = await axios.get("/api/analytics/subjects");
  return data;
};

/**
 * Get exam-wise analytics
 */
export const getExamAnalytics = async () => {
  const { data } = await axios.get("/api/analytics/exams");
  return data;
};

/* ---------------- STUDENT ANALYTICS ---------------- */

/**
 * Get performance trend for a single student
 * @param {string} studentId
 */
export const getStudentPerformanceTrend = async (studentId) => {
  const { data } = await axios.get(
    `/api/analytics/student/${studentId}`
  );
  return data;
};

/**
 * Get AI-based insights (optional)
 */
export const getStudentInsights = async (studentId) => {
  const { data } = await axios.get(
    `/api/analytics/student/${studentId}/insights`
  );
  return data;
};

/* ---------------- REPORTS ---------------- */

/**
 * Get reports (role-based handled by backend)
 * @param {Object} filters
 */
export const getReports = async (filters = {}) => {
  const { data } = await axios.get("/api/reports", {
    params: filters,
  });
  return data;
};

/**
 * Schedule reports to be emailed as PDF
 * @param {Object} payload
 */
export const scheduleReportEmail = async (payload) => {
  const { data } = await axios.post(
    "/api/reports/schedule",
    payload
  );
  return data;
};

/* ---------------- EXPORTS ---------------- */

/**
 * Export report as PDF (backend-generated)
 * @param {Object} payload
 */
export const exportReportPDF = async (payload) => {
  const { data } = await axios.post(
    "/api/reports/export/pdf",
    payload,
    {
      responseType: "blob",
    }
  );
  return data;
};

/**
 * Export report as CSV
 */
export const exportReportCSV = async () => {
  const { data } = await axios.get("/api/reports/export/csv", {
    responseType: "blob",
  });
  return data;
};
