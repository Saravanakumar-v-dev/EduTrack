// client/src/components/UploadGrades.jsx
import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";
import { motion } from "framer-motion";

export default function UploadGrades() {
  const [fileName, setFileName] = useState(null);
  const [previewRows, setPreviewRows] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setPreviewRows(results.data.slice(0, 10)); // show first 10 rows
        },
      });
    } else {
      // For XLSX you might parse on backend; here we simply show filename
      setPreviewRows([]);
    }
  };

  const handleUpload = async () => {
    const input = document.getElementById("gradeFile");
    if (!input.files[0]) {
      setMessage({ type: "error", text: "Please select a file first." });
      return;
    }
    const formData = new FormData();
    formData.append("file", input.files[0]);

    try {
      setUploading(true);
      setMessage(null);
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/grades/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      setMessage({ type: "success", text: res.data.message || "Upload complete" });
      setPreviewRows([]);
      setFileName(null);
      input.value = "";
    } catch (err) {
      setMessage({ type: "error", text: err?.response?.data?.message || err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-white glass rounded-2xl">
      <h2 className="text-lg font-semibold mb-2">Upload Grades</h2>
      <p className="text-sm text-gray-500 mb-4">Supported: CSV (recommended). Columns: studentEmail, subject, marks, maxMarks</p>

      <div className="flex gap-3 items-center">
        <label className="cursor-pointer">
          <input id="gradeFile" type="file" accept=".csv, .xlsx, .xls" onChange={handleFile} className="hidden" />
          <div className="px-4 py-2 rounded-lg border border-dashed border-slate-200 hover:bg-slate-50 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-5 h-5 mr-2 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3v12m0 0l4-4m-4 4l-4-4M21 21H3"/></svg>
            <span className="text-sm">Select file</span>
            <span className="ml-3 text-xs text-gray-400">{fileName || "No file chosen"}</span>
          </div>
        </label>

        <button onClick={handleUpload} disabled={uploading} className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:opacity-95 transition">
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {message.text}
        </div>
      )}

      {previewRows.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                {Object.keys(previewRows[0]).map((k) => (
                  <th key={k} className="py-2 pr-4">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, idx) => (
                <tr key={idx} className="border-b last:border-b-0">
                  {Object.values(row).map((v, i) => <td key={i} className="py-2 pr-4">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
