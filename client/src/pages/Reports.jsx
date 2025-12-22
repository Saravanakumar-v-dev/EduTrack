// src/pages/Reports.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/api";
import { FaDownload, FaChartBar, FaChartLine } from "react-icons/fa";
import {
  exportToCSV,
  calculateAverageGrade,
  formatDate,
} from "../utils/helpers";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from "recharts";
import { toast } from "react-hot-toast";

const Reports = () => {
  const [gradesData, setGradesData] = useState([]);
  const [averageGrade, setAverageGrade] = useState(0);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await axios.get("/grades");
        setGradesData(res.data);
        setAverageGrade(calculateAverageGrade(res.data.map((g) => g.score)));
      } catch (err) {
        toast.error("Failed to fetch grades");
      }
    };

    fetchGrades();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaChartLine /> Student Reports
        </h2>
        <button
          onClick={() => exportToCSV(gradesData, "student_grades.csv")}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all"
        >
          <FaDownload /> Export CSV
        </button>
      </div>

      <div className="mb-6">
        <p className="text-lg">
          Average Grade: <span className="font-semibold">{averageGrade}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FaChartLine /> Performance Trend
          </h3>
          <LineChart width={400} height={250} data={gradesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="studentName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8884d8" />
          </LineChart>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <FaChartBar /> Subject-wise Performance
          </h3>
          <BarChart width={400} height={250} data={gradesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="subject" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Student Name</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Score</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {gradesData.map((grade) => (
              <tr key={grade._id} className="text-center border-t">
                <td className="px-4 py-2">{grade.studentName}</td>
                <td className="px-4 py-2">{grade.subject}</td>
                <td className="px-4 py-2">{grade.score}</td>
                <td className="px-4 py-2">{formatDate(grade.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
