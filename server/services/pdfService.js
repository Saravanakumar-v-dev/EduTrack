// server/services/pdfService.js

import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* ======================================================
   PATH SETUP (ESM SAFE)
====================================================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ======================================================
   GENERATE STUDENT PDF REPORT
====================================================== */
/**
 * Generates a detailed PDF report for a student
 *
 * @param {string} filename - Output PDF file name
 * @param {Object} data
 * @param {Object} data.student
 * @param {Array}  data.marks
 * @param {Array}  data.attendance
 * @param {Array}  data.badges
 * @param {Object} data.overview
 *
 * @returns {Promise<string>} Absolute file path
 */
export const generatePDFReport = (
  filename,
  {
    student,
    overview = {},
    marks = [],
    attendance = [],
    badges = [],
  }
) => {
  return new Promise((resolve, reject) => {
    try {
      const reportsDir = path.resolve(
        __dirname,
        "../../reports"
      );

      if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
      }

      const filePath = path.join(reportsDir, filename);
      const doc = new PDFDocument({ margin: 50 });

      doc.pipe(fs.createWriteStream(filePath));

      /* ======================================================
         HEADER
      ====================================================== */
      doc
        .fontSize(22)
        .text("EduTrack – Student Academic Report", {
          align: "center",
        });

      doc.moveDown(2);

      /* ======================================================
         STUDENT INFO
      ====================================================== */
      doc.fontSize(14).text("Student Information", {
        underline: true,
      });
      doc.moveDown(0.5);

      doc.fontSize(11);
      doc.text(`Name: ${student.name}`);
      doc.text(`Email: ${student.email}`);
      if (student.rollNumber)
        doc.text(`Roll Number: ${student.rollNumber}`);
      if (student.department)
        doc.text(`Department: ${student.department}`);
      doc.moveDown();

      /* ======================================================
         OVERVIEW
      ====================================================== */
      doc.fontSize(14).text("Performance Overview", {
        underline: true,
      });
      doc.moveDown(0.5);

      Object.entries(overview).forEach(([key, value]) => {
        doc.fontSize(11).text(
          `${formatLabel(key)}: ${value}`
        );
      });

      doc.moveDown();

      /* ======================================================
         MARKS TABLE
      ====================================================== */
      doc.fontSize(14).text("Marks Summary", {
        underline: true,
      });
      doc.moveDown(0.5);

      if (marks.length === 0) {
        doc
          .fontSize(11)
          .text("No marks available.");
      } else {
        marks.forEach((m) => {
          doc.fontSize(11).text(
            `${m.subject} | ${m.examType} | Score: ${m.score}%`
          );
        });
      }

      doc.moveDown();

      /* ======================================================
         ATTENDANCE SUMMARY
      ====================================================== */
      doc.fontSize(14).text("Attendance", {
        underline: true,
      });
      doc.moveDown(0.5);

      if (attendance.length === 0) {
        doc
          .fontSize(11)
          .text("No attendance records found.");
      } else {
        attendance.forEach((a) => {
          doc.fontSize(11).text(
            `${new Date(a.date).toDateString()} : ${
              a.present ? "Present" : "Absent"
            }`
          );
        });
      }

      doc.moveDown();

      /* ======================================================
         BADGES
      ====================================================== */
      doc.fontSize(14).text("Achievements & Badges", {
        underline: true,
      });
      doc.moveDown(0.5);

      if (badges.length === 0) {
        doc
          .fontSize(11)
          .text("No badges awarded yet.");
      } else {
        badges.forEach((b) => {
          doc.fontSize(11).text(
            `${b.icon || "🏅"} ${b.title} – ${b.description}`
          );
        });
      }

      /* ======================================================
         FOOTER
      ====================================================== */
      doc.moveDown(3);
      doc
        .fontSize(9)
        .text(
          `Generated on ${new Date().toLocaleString()} | EduTrack`,
          { align: "center", color: "gray" }
        );

      doc.end();

      doc.on("finish", () => resolve(filePath));
    } catch (err) {
      reject(
        new Error(`PDF generation failed: ${err.message}`)
      );
    }
  });
};

/* ======================================================
   HELPER
====================================================== */
const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase());
