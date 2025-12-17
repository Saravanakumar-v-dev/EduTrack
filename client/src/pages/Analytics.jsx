// client/src/pages/Analytics.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/api"; // axios instance with baseURL + auth interceptor
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { FaChartLine, FaChartBar, FaChartPie } from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const Analytics = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewRange, setViewRange] = useState("6m"); // options: 3m, 6m, 12m

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      try {
        // backend endpoints must return arrays in an expected shape
        // /analytics/performance -> [{ month: "2025-01", averageScore: 82 }, ...]
        // /analytics/attendance  -> [{ month: "2025-01", attendancePct: 92 }, ...]
        // /analytics/grades      -> [{ grade: "A", count: 120 }, { grade: "B", count: 90 }, ...]
        const [perfRes, attRes, gradeRes] = await Promise.all([
          axios.get("/analytics/performance", { params: { range: viewRange } }),
          axios.get("/analytics/attendance", { params: { range: viewRange } }),
          axios.get("/analytics/grades", { params: { range: viewRange } }),
        ]);

        if (!mounted) return;

        // Normalize performance: ensure month label friendly for XAxis
        const perf = Array.isArray(perfRes.data)
          ? perfRes.data.map((d) => ({
              month: d.monthLabel || d.month, // monthLabel: "Jan 2025" or iso "2025-01"
              averageScore: Number(d.averageScore ?? d.avg ?? d.average ?? 0),
            }))
          : [];

        const att = Array.isArray(attRes.data)
          ? attRes.data.map((d) => ({
              month: d.monthLabel || d.month,
              attendance: Number(d.attendancePct ?? d.attendance ?? 0),
            }))
          : [];

        const grades = Array.isArray(gradeRes.data)
          ? gradeRes.data.map((d) => ({
              name: d.grade || d._id || d.name,
              value: Number(d.count ?? d.value ?? d.qty ?? 0),
            }))
          : [];

        setPerformanceData(perf);
        setAttendanceData(att);
        setGradeDistribution(grades);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        toast.error("Failed to fetch analytics from server. Check backend.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAll();
    return () => {
      mounted = false;
    };
  }, [viewRange]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-6xl mx-auto"
      >
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-3">
              <FaChartLine className="text-indigo-600" /> Student Analytics
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Live class & student analytics (powered by DB aggregations)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={viewRange}
              onChange={(e) => setViewRange(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="3m">Last 3 months</option>
              <option value="6m">Last 6 months</option>
              <option value="12m">Last 12 months</option>
            </select>
            <button
              onClick={() => {
                setLoading(true);
                // small re-fetch by toggling viewRange to same value (or call fetch separately)
                setTimeout(() => setLoading(false), 500);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Refresh
            </button>
          </div>
        </header>

        {/* Performance Line Chart */}
        <section className="mb-10 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FaChartLine /> Academic Performance (Average Score)
          </h2>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="averageScore" stroke={COLORS[0]} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Attendance Bar Chart */}
        <section className="mb-10 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FaChartBar /> Attendance Overview (%)
          </h2>
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="attendance" fill={COLORS[1]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Grade Distribution Pie Chart */}
        <section className="mb-10 bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FaChartPie /> Grade Distribution
          </h2>
          <div className="flex justify-center">
            <div style={{ width: "60%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Analytics;
