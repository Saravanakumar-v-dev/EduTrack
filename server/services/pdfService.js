import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate a PDF report for a student
 * @param {string} filename - Output PDF filename
 * @param {Object} reportData - Student data
 * @returns {Promise<string>} - File path to generated PDF
 */
export const generatePDFReport = (filename, reportData) => {
  return new Promise((resolve, reject) => {
    try {
      const outputDir = path.join(__dirname, "../../reports");
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

      const outputPath = path.join(outputDir, filename);
      const doc = new PDFDocument();

      doc.pipe(fs.createWriteStream(outputPath));
      doc.fontSize(20).text("📘 EduTrack+ Student Report", { align: "center" });
      doc.moveDown();

      for (const [key, value] of Object.entries(reportData)) {
        doc.fontSize(12).text(`${key}: ${value}`);
      }

      doc.end();
      doc.on("finish", () => resolve(outputPath));
    } catch (error) {
      reject(error);
    }
  });
};