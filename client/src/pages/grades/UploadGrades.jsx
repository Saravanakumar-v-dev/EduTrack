import { useState } from "react";
import axios from "../../api/axios";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";

const UploadGrades = () => {
  const [file, setFile] = useState(null);
  const [examName, setExamName] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !examName || !subject) {
      setError("Please fill all fields and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("examName", examName);
    formData.append("subject", subject);

    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post(
        "/api/grades/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(data.message || "Grades uploaded successfully.");
      setFile(null);
      setExamName("");
      setSubject("");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to upload grades."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-semibold mb-2">
            Upload Grades
          </h2>
          <p className="text-gray-600 mb-6">
            Upload student grades using CSV or Excel files
          </p>

          <div className="bg-white p-6 rounded shadow max-w-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EXAM NAME */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Exam Name
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="Mid Term / Unit Test 1"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              {/* SUBJECT */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Mathematics"
                  className="w-full border rounded px-3 py-2 text-sm"
                />
              </div>

              {/* FILE UPLOAD */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Upload File
                </label>
                <input
                  type="file"
                  accept=".csv, .xlsx"
                  onChange={handleFileChange}
                  className="w-full text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: CSV, XLSX
                </p>
              </div>

              {/* ACTION BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Upload Grades"}
              </button>

              {/* FEEDBACK */}
              {message && (
                <p className="text-green-600 text-sm mt-2">
                  {message}
                </p>
              )}
              {error && (
                <p className="text-red-600 text-sm mt-2">
                  {error}
                </p>
              )}
            </form>
          </div>

          {/* FILE FORMAT INFO */}
          <div className="bg-white p-4 rounded shadow mt-6 max-w-xl">
            <h4 className="font-semibold mb-2">
              Required File Format
            </h4>
            <p className="text-sm text-gray-600 mb-2">
              Your CSV / Excel file should contain the following
              columns:
            </p>
            <ul className="text-sm text-gray-700 list-disc ml-5">
              <li>studentId</li>
              <li>studentName</li>
              <li>marks</li>
            </ul>
          </div>
        </main>
      </div>
    </>
  );
};

export default UploadGrades;
