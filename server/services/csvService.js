// server/services/csvService.js

import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import { Parser as Json2CsvParser } from "json2csv";

/* ======================================================
   PARSE CSV FILE → JSON
====================================================== */
/**
 * Reads a CSV file from disk and converts it to JSON
 * @param {string} filePath - Absolute or relative file path
 * @returns {Promise<Array<Object>>}
 */
export const parseCsvFile = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    if (!fs.existsSync(filePath)) {
      return reject(new Error("CSV file not found"));
    }

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        // Trim keys & values
        const cleanRow = {};
        Object.keys(row).forEach((key) => {
          cleanRow[key.trim()] =
            typeof row[key] === "string" ? row[key].trim() : row[key];
        });
        results.push(cleanRow);
      })
      .on("end", () => resolve(results))
      .on("error", (err) =>
        reject(new Error(`CSV parsing failed: ${err.message}`))
      );
  });
};

/* ======================================================
   JSON → CSV STRING
====================================================== */
/**
 * Converts JSON array into CSV string
 * @param {Array<Object>} data
 * @param {Array<string>} fields
 * @returns {string}
 */
export const generateCsvString = (data, fields) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No data provided for CSV generation");
  }

  try {
    const parser = new Json2CsvParser({
      fields,
      defaultValue: "",
    });

    return parser.parse(data);
  } catch (error) {
    throw new Error(`CSV generation failed: ${error.message}`);
  }
};

/* ======================================================
   JSON → CSV FILE (SAVE TO DISK)
====================================================== */
/**
 * Generates a CSV file and saves it to disk
 * @param {Array<Object>} data
 * @param {string} fileName
 * @param {string} outputDir
 * @param {Array<string>} fields
 * @returns {Promise<string>} absolute file path
 */
export const generateAndSaveCsvFile = (
  data,
  fileName,
  outputDir = "exports",
  fields
) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(data) || data.length === 0) {
      return reject(new Error("No data available to export"));
    }

    const exportDir = path.resolve(process.cwd(), outputDir);

    // Ensure directory exists
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const safeFileName = fileName.endsWith(".csv")
      ? fileName
      : `${fileName}.csv`;

    const filePath = path.join(exportDir, safeFileName);

    try {
      const csvString = generateCsvString(data, fields);
      fs.writeFileSync(filePath, csvString, "utf8");
      resolve(filePath);
    } catch (error) {
      reject(new Error(`Failed to save CSV file: ${error.message}`));
    }
  });
};
