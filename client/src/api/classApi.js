import axios from "./axios";

/*
|--------------------------------------------------------------------------
| Class API Layer
|--------------------------------------------------------------------------
| Handles classes, sections, subjects, and class assignments
| Used by Admin and Teacher dashboards
|--------------------------------------------------------------------------
*/

/* ---------------- CLASS CRUD ---------------- */

/**
 * Get all classes
 * Filters: academicYear, grade, section
 */
export const getAllClasses = async (params = {}) => {
  const { data } = await axios.get("/api/classes", {
    params,
  });
  return data;
};

/**
 * Get class by ID
 */
export const getClassById = async (classId) => {
  const { data } = await axios.get(
    `/api/classes/${classId}`
  );
  return data;
};

/**
 * Create new class (Admin)
 */
export const createClass = async (payload) => {
  const { data } = await axios.post(
    "/api/classes",
    payload
  );
  return data;
};

/**
 * Update class details (Admin)
 */
export const updateClass = async (classId, payload) => {
  const { data } = await axios.put(
    `/api/classes/${classId}`,
    payload
  );
  return data;
};

/**
 * Delete class (Admin)
 */
export const deleteClass = async (classId) => {
  const { data } = await axios.delete(
    `/api/classes/${classId}`
  );
  return data;
};

/* ---------------- CLASS ASSIGNMENTS ---------------- */

/**
 * Assign students to class
 */
export const assignStudentsToClass = async (
  classId,
  payload
) => {
  const { data } = await axios.post(
    `/api/classes/${classId}/assign-students`,
    payload
  );
  return data;
};

/**
 * Assign teacher to class
 */
export const assignTeacherToClass = async (
  classId,
  payload
) => {
  const { data } = await axios.post(
    `/api/classes/${classId}/assign-teacher`,
    payload
  );
  return data;
};

/**
 * Assign subjects to class
 */
export const assignSubjectsToClass = async (
  classId,
  payload
) => {
  const { data } = await axios.post(
    `/api/classes/${classId}/assign-subjects`,
    payload
  );
  return data;
};

/**
 * Get class assignments (students, teachers, subjects)
 */
export const getClassAssignments = async (classId) => {
  const { data } = await axios.get(
    `/api/classes/${classId}/assignments`
  );
  return data;
};

/* ---------------- CLASS ANALYTICS ---------------- */

/**
 * Get performance analytics for a class
 */
export const getClassPerformance = async (classId) => {
  const { data } = await axios.get(
    `/api/classes/${classId}/performance`
  );
  return data;
};

/**
 * Get subject-wise performance for a class
 */
export const getClassSubjectPerformance = async (
  classId
) => {
  const { data } = await axios.get(
    `/api/classes/${classId}/subjects`
  );
  return data;
};

/* ---------------- CLASS REPORTS ---------------- */

/**
 * Get reports for a class
 */
export const getClassReports = async (classId) => {
  const { data } = await axios.get(
    `/api/reports/class/${classId}`
  );
  return data;
};
