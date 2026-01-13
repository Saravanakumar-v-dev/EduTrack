import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  Download,
  FileText,
  Mail,
  TrendingUp,
  Filter,
  Search,
  X,
  Calendar,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Reports = () => {
  const { user } = useAuth();
  const role = user?.role || "student";

  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reports, setReports] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterExam, setFilterExam] = useState("all");
  const [filterGrade, setFilterGrade] = useState("all");
  const [filterSection, setFilterSection] = useState("all");

  const subjects = ["Mathematics", "Physics", "Chemistry", "English", "Computer Science", "History"];
  const exams = ["Unit 1", "Unit 2", "Midterm", "Unit 3", "Unit 4", "Final"];
  const grades = ["A+", "A", "B+", "B", "C+", "C", "D", "F"];
  const sections = ["Section A", "Section B", "Section C", "Section D"];

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      setReports([
        { id: 1, studentName: "John Doe", subject: "Mathematics", exam: "Midterm", marks: 85, maxMarks: 100, grade: "A", section: "Section A" },
        { id: 2, studentName: "John Doe", subject: "Physics", exam: "Midterm", marks: 78, maxMarks: 100, grade: "B+", section: "Section A" },
        { id: 3, studentName: "Jane Smith", subject: "Chemistry", exam: "Final", marks: 92, maxMarks: 100, grade: "A+", section: "Section B" },
        { id: 4, studentName: "Jane Smith", subject: "English", exam: "Final", marks: 88, maxMarks: 100, grade: "A", section: "Section B" },
        { id: 5, studentName: "Mike Johnson", subject: "Computer Science", exam: "Unit 3", marks: 95, maxMarks: 100, grade: "A+", section: "Section A" },
        { id: 6, studentName: "Sarah Williams", subject: "History", exam: "Midterm", marks: 72, maxMarks: 100, grade: "B", section: "Section C" },
        { id: 7, studentName: "Tom Brown", subject: "Mathematics", exam: "Final", marks: 65, maxMarks: 100, grade: "C+", section: "Section D" },
        { id: 8, studentName: "Emily Davis", subject: "Physics", exam: "Unit 2", marks: 81, maxMarks: 100, grade: "A", section: "Section B" },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Filtered reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "all" || report.subject === filterSubject;
    const matchesExam = filterExam === "all" || report.exam === filterExam;
    const matchesGrade = filterGrade === "all" || report.grade === filterGrade;
    const matchesSection = filterSection === "all" || report.section === filterSection;

    return matchesSearch && matchesSubject && matchesExam && matchesGrade && matchesSection;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setFilterSubject("all");
    setFilterExam("all");
    setFilterGrade("all");
    setFilterSection("all");
  };

  // Export to CSV
  const exportCSV = () => {
    const headers = ["Student", "Subject", "Exam", "Marks", "Max Marks", "Grade", "Section"];
    const csvData = filteredReports.map(r =>
      [r.studentName, r.subject, r.exam, r.marks, r.maxMarks, r.grade, r.section].join(",")
    );

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `EduTrack_Reports_${new Date().toLocaleDateString()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exported ${filteredReports.length} records to CSV!`);
  };

  // Export to PDF (placeholder - would use jsPDF in production)
  const exportPDF = () => {
    toast.success("PDF export started! (Install jsPDF for full functionality)");
  };

  const scheduleEmail = () => {
    toast.success("Report scheduled for email delivery!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Reports 📄</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
            View and export academic performance reports
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
          >
            <Download size={18} />
            Export CSV
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            <Download size={18} />
            Export PDF
          </motion.button>

          {role !== "student" && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={scheduleEmail}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
            >
              <Mail size={18} />
              Schedule Email
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* SEARCH AND FILTER BAR */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by student name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition ${showFilters
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            <Filter size={18} />
            Filters
            {(filterSubject !== "all" || filterExam !== "all" || filterGrade !== "all" || filterSection !== "all") && (
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Subject</label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Subjects</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Exam</label>
              <select
                value={filterExam}
                onChange={(e) => setFilterExam(e.target.value)}
                className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Exams</option>
                {exams.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Grade</label>
              <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Grades</option>
                {grades.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Section</label>
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Sections</option>
                {sections.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <X size={16} />
                Clear All
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* REPORTS TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <FileText className="text-indigo-600 dark:text-indigo-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Performance Reports
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredReports.length} of {reports.length} records
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Student</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Subject</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Exam</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Section</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Marks</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Grade</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{report.studentName}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">{report.subject}</td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-300">{report.exam}</td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                        {report.section}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900 dark:text-white">{report.marks}</span>
                      <span className="text-gray-400 dark:text-gray-500">/{report.maxMarks}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${report.grade.includes("A") ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                          report.grade.includes("B") ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" :
                            report.grade.includes("C") ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" :
                              "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}>
                        {report.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedStudent(report)}
                        className="p-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition text-indigo-600 dark:text-indigo-400"
                        title="View Trend"
                      >
                        <TrendingUp size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500 dark:text-gray-400">
                    No reports found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* PERFORMANCE TREND (when student selected) */}
      {selectedStudent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance Trend – {selectedStudent.studentName}
            </h3>
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { exam: "Unit 1", marks: 75 },
              { exam: "Unit 2", marks: 78 },
              { exam: "Midterm", marks: 82 },
              { exam: "Unit 3", marks: 80 },
              { exam: "Final", marks: selectedStudent.marks },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis
                dataKey="exam"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#4b5563' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#9ca3af' }}
                axisLine={{ stroke: '#4b5563' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3)",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="marks"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#6366f1", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  );
};

export default Reports;
