import axios from "./axios";

/*
|--------------------------------------------------------------------------
| Student API Layer
|--------------------------------------------------------------------------
| Centralized student-related API calls
| Used by Admin, Teacher, and Student dashboards
|--------------------------------------------------------------------------
*/

/* ---------------- STUDENT CRUD ---------------- */

/**
 * Get all students (Admin / Teacher)
 * Supports pagination & filters
 */
export const getAllStudents = async (params = {}) => {
  const { data } = await axios.get("/api/students", {
    params,
  });
  return data;
};

/**
 * Get single student by ID
 */
export const getStudentById = async (studentId) => {
  const { data } = await axios.get(
    `/api/students/${studentId}`
  );
  return data;
};

/**
 * Create new student (Admin only)
 */
export const createStudent = async (payload) => {
  const { data } = await axios.post(
    "/api/students",
    payload
  );
  return data;
};

/**
 * Update student details (Admin)
 */
export const updateStudent = async (studentId, payload) => {
  const { data } = await axios.put(
    `/api/students/${studentId}`,
    payload
  );
  return data;
};

/**
 * Delete student (Admin)
 */
export const deleteStudent = async (studentId) => {
  const { data } = await axios.delete(
    `/api/students/${studentId}`
  );
  return data;
};

/* ---------------- STUDENT PERFORMANCE ---------------- */

/**
 * Get student grades & performance summary
 */
export const getStudentPerformance = async (studentId) => {
  const { data } = await axios.get(
    `/api/students/${studentId}/performance`
  );
  return data;
};

/**
 * Get student attendance (optional)
 */
export const getStudentAttendance = async (studentId) => {
  const { data } = await axios.get(
    `/api/students/${studentId}/attendance`
  );
  return data;
};

/* ---------------- BULK OPERATIONS ---------------- */

/**
 * Bulk upload students (CSV / Excel)
 */
export const bulkUploadStudents = async (formData) => {
  const { data } = await axios.post(
    "/api/students/bulk-upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

/* ---------------- STUDENT REPORTS ---------------- */

/**
 * Get reports for a specific student
 */
export const getStudentReports = async (studentId) => {
  const { data } = await axios.get(
    `/api/reports/student/${studentId}`
  );
  return data;
};
