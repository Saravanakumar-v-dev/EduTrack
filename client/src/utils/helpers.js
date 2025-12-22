// client/src/utils/Helpers.js

import { toast } from "react-hot-toast";

/**
 * Format a given date into a readable format (e.g., Jan 15, 2025)
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * Calculate the average of a numeric array
 */
export const calculateAverage = (arr) => {
  if (!arr || arr.length === 0) return 0;
  const total = arr.reduce((sum, val) => sum + parseFloat(val || 0), 0);
  return (total / arr.length).toFixed(2);
};

/**
 * Display a success toast message
 */
export const showSuccess = (message) => {
  toast.success(message || "Operation successful!", {
    style: {
      background: "#22c55e",
      color: "#fff",
      fontWeight: "bold",
    },
  });
};

/**
 * Display an error toast message
 */
export const showError = (message) => {
  toast.error(message || "Something went wrong!", {
    style: {
      background: "#ef4444",
      color: "#fff",
      fontWeight: "bold",
    },
  });
};

/**
 * Validate an email address
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate a password (min 6 chars)
 */
export const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Convert CSV string to JSON (simple version, uses PapaParse internally if needed)
 * This is helpful if you import student data.
 */
export const csvToJson = (csvText) => {
  const lines = csvText.split("\n");
  const headers = lines[0].split(",");
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(",");
    headers.forEach((header, index) => {
      obj[header.trim()] = currentline[index] ? currentline[index].trim() : "";
    });
    result.push(obj);
  }

  return result;
};

/**
 * Calculate grade based on percentage
 */
export const getGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
};

/**
 * Generate a random student ID (for local mock uploads)
 */
export const generateStudentID = () => {
  const prefix = "STU";
  const randomNum = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}${randomNum}`;
};

/**
 * Capitalize the first letter of a string
 */
export const capitalize = (text) => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};
// src/utils/helpers.js

// Example: calculate average grade
export const calculateAverageGrade = (grades) => {
  if (!grades || grades.length === 0) return 0;
  const sum = grades.reduce((acc, curr) => acc + Number(curr), 0);
  return (sum / grades.length).toFixed(2);
};

// Example: export data to CSV
export const exportToCSV = (data, filename = "report.csv") => {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  for (const row of data) {
    const values = headers.map((header) => `"${row[header]}"`);
    csvRows.push(values.join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Format date
