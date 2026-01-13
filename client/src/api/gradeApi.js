import axios from "./axios";

/*
|--------------------------------------------------------------------------
| Grade API Layer
|--------------------------------------------------------------------------
| Handles grades, exams, assessments, and analytics
| Used by Teacher, Admin dashboards, and Reports
|--------------------------------------------------------------------------
*/

/* ---------------- GRADE CRUD ---------------- */

/**
 * Upload grades (CSV / Excel)
 * Used by teachers
 */
export const uploadGrades = async (formData) => {
  const { data } = await axios.post(
    "/api/grades/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

/**
 * Get all grades
 * Role-based filtering handled by backend
 */
export const getAllGrades = async (params = {}) => {
  const { data } = await axios.get("/api/grades", {
    params,
  });
  return data;
};

/**
 * Get grades by student ID
 */
export const getGradesByStudent = async (studentId) => {
  const { data } = await axios.get(
    `/api/grades/student/${studentId}`
  );
  return data;
};

/**
 * Get grades by class & subject
 */
export const getGradesByClass = async (params) => {
  const { data } = await axios.get("/api/grades/class", {
    params,
  });
  return data;
};

/**
 * Update a grade record
 * Admin / Teacher
 */
export const updateGrade = async (gradeId, payload) => {
  const { data } = await axios.put(
    `/api/grades/${gradeId}`,
    payload
  );
  return data;
};

/**
 * Delete a grade record
 * Admin only
 */
export const deleteGrade = async (gradeId) => {
  const { data } = await axios.delete(
    `/api/grades/${gradeId}`
  );
  return data;
};

/* ---------------- EXAMS & ASSESSMENTS ---------------- */

/**
 * Get list of exams
 */
export const getExams = async () => {
  const { data } = await axios.get("/api/exams");
  return data;
};

/**
 * Create new exam
 */
export const createExam = async (payload) => {
  const { data } = await axios.post(
    "/api/exams",
    payload
  );
  return data;
};

/**
 * Get exam analytics
 */
export const getExamAnalytics = async (examId) => {
  const { data } = await axios.get(
    `/api/exams/${examId}/analytics`
  );
  return data;
};

/* ---------------- REPORT EXPORT ---------------- */

/**
 * Export grades as CSV
 */
export const exportGradesCSV = async (params = {}) => {
  const { data } = await axios.get(
    "/api/grades/export/csv",
    {
      params,
      responseType: "blob",
    }
  );
  return data;
};

/**
 * Export grades as PDF
 */
export const exportGradesPDF = async (params = {}) => {
  const { data } = await axios.post(
    "/api/grades/export/pdf",
    params,
    {
      responseType: "blob",
    }
  );
  return data;
};
