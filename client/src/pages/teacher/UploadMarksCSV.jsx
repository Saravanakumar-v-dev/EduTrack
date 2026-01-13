import { useState } from "react";
import axios from "../../api/axios";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import { toast } from "react-hot-toast";

const UploadMarksCSV = () => {
  const [file, setFile] = useState(null);

  const uploadHandler = async () => {
    if (!file) return toast.error("Select a CSV file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/marks/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("CSV uploaded successfully");
    } catch {
      toast.error("Upload failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Upload Marks (CSV)
          </h2>

          <div className="bg-white p-6 rounded shadow max-w-md">
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button
              onClick={uploadHandler}
              className="block mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Upload
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default UploadMarksCSV;
