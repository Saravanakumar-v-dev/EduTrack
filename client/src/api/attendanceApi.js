import axios from "./axios";

/*
|--------------------------------------------------------------------------
| Attendance API Layer
|--------------------------------------------------------------------------
| Handles student attendance, bulk marking, reports, and analytics
| Used by Teacher, Admin dashboards
|--------------------------------------------------------------------------
*/

/* ---------------- ATTENDANCE MARKING ---------------- */

/**
 * Mark attendance for a class on a specific date
 * Teacher/Admin
 * payload example:
 * {
 *   classId,
 *   date,
 *   records: [
 *     { studentId, status: "present" | "absent" | "late" }
 *   ]
 * }
 */
export const markAttendance = async (payload) => {
  const { data } = await axios.post(
    "/api/attendance/mark",
    payload
  );
  return data;
};

/**
 * Update attendance for a student
 */
export const updateAttendance = async (attendanceId, payload) => {
  const { data } = await axios.put(
    `/api/attendance/${attendanceId}`,
    payload
  );
  return data;
};

/* ---------------- FETCH ATTENDANCE ---------------- */

/**
 * Get attendance by class & date
 * params: { classId, date }
 */
export const getAttendanceByClass = async (params) => {
  const { data } = await axios.get(
    "/api/attendance/class",
    { params }
  );
  return data;
};

/**
 * Get attendance for a student
 * params: { startDate, endDate }
 */
export const getAttendanceByStudent = async (
  studentId,
  params = {}
) => {
  const { data } = await axios.get(
    `/api/attendance/student/${studentId}`,
    { params }
  );
  return data;
};

/**
 * Get attendance for a class (date range)
 */
export const getAttendanceRangeByClass = async (
  classId,
  params = {}
) => {
  const { data } = await axios.get(
    `/api/attendance/class/${classId}`,
    { params }
  );
  return data;
};

/* ---------------- ATTENDANCE ANALYTICS ---------------- */

/**
 * Get attendance summary for a student
 * Returns % present, absent, late
 */
export const getStudentAttendanceSummary = async (
  studentId
) => {
  const { data } = await axios.get(
    `/api/attendance/student/${studentId}/summary`
  );
  return data;
};

/**
 * Get attendance analytics for a class
 */
export const getClassAttendanceAnalytics = async (
  classId
) => {
  const { data } = await axios.get(
    `/api/attendance/class/${classId}/analytics`
  );
  return data;
};

/* ---------------- BULK OPERATIONS ---------------- */

/**
 * Bulk upload attendance (CSV / Excel)
 */
export const bulkUploadAttendance = async (
  formData
) => {
  const { data } = await axios.post(
    "/api/attendance/bulk-upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

/* ---------------- REPORT EXPORT ---------------- */

/**
 * Export attendance report as CSV
 */
export const exportAttendanceCSV = async (
  params = {}
) => {
  const { data } = await axios.get(
    "/api/attendance/export/csv",
    {
      params,
      responseType: "blob",
    }
  );
  return data;
};

/**
 * Export attendance report as PDF
 */
export const exportAttendancePDF = async (
  params = {}
) => {
  const { data } = await axios.post(
    "/api/attendance/export/pdf",
    params,
    {
      responseType: "blob",
    }
  );
  return data;
};
