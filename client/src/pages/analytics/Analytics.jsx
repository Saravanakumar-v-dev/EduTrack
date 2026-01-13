import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Award,
  Clock,
  Target,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AuthContext } from "../../context/AuthContext";

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    avgScore: 78.5,
    passRate: 85,
    atRiskStudents: 12,
    totalAssignments: 45,
  });

  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [studentTrends, setStudentTrends] = useState([]);
  const [gradeDistribution, setGradeDistribution] = useState([]);

  useEffect(() => {
    // Simulate loading with mock data based on user role
    setTimeout(() => {
      setSubjectPerformance([
        { subject: "Mathematics", averageScore: 82 },
        { subject: "Physics", averageScore: 75 },
        { subject: "Chemistry", averageScore: 71 },
        { subject: "English", averageScore: 88 },
        { subject: "Computer Science", averageScore: 90 },
        { subject: "History", averageScore: 68 },
      ]);

      setStudentTrends([
        { exam: "Unit 1", averageScore: 72 },
        { exam: "Unit 2", averageScore: 75 },
        { exam: "Midterm", averageScore: 78 },
        { exam: "Unit 3", averageScore: 76 },
        { exam: "Unit 4", averageScore: 80 },
        { exam: "Final", averageScore: 82 },
      ]);

      setGradeDistribution([
        { name: "A", value: 25, color: "#10b981" },
        { name: "B", value: 35, color: "#3b82f6" },
        { name: "C", value: 25, color: "#f59e0b" },
        { name: "D", value: 10, color: "#ef4444" },
        { name: "F", value: 5, color: "#6b7280" },
      ]);

      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const getRoleTitle = () => {
    switch (user?.role) {
      case "admin": return "Institution Analytics";
      case "teacher": return "Class Analytics";
      case "student": return "My Performance";
      default: return "Performance Analytics";
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {getRoleTitle()} 📊
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
          {user?.role === "student"
            ? "Track your academic progress and performance"
            : "Track and analyze academic performance trends"
          }
        </p>
      </motion.div>

      {/* KPI CARDS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <KpiCard
          title="Average Score"
          value={`${overview.avgScore}%`}
          icon={<TrendingUp size={24} />}
          color="indigo"
          trend="+2.5%"
        />
        <KpiCard
          title="Pass Rate"
          value={`${overview.passRate}%`}
          icon={<Award size={24} />}
          color="emerald"
          trend="+5%"
        />
        <KpiCard
          title="At-Risk Students"
          value={overview.atRiskStudents}
          icon={<AlertTriangle size={24} />}
          color="red"
          trend="-3"
        />
        <KpiCard
          title="Assignments"
          value={overview.totalAssignments}
          icon={<BookOpen size={24} />}
          color="purple"
          subtitle="This semester"
        />
      </motion.div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <BarChart3 className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Subject-wise Performance
            </h3>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis
                dataKey="subject"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
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
              <Bar
                dataKey="averageScore"
                fill="#4f46e5"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <TrendingUp className="text-emerald-600 dark:text-emerald-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance Trend
            </h3>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={studentTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis
                dataKey="exam"
                tick={{ fontSize: 12, fill: '#9ca3af' }}
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
                dataKey="averageScore"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ADDITIONAL ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Target className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Grade Distribution
            </h3>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {gradeDistribution.map((grade, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: grade.color }} />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {grade.name}: {grade.value}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Clock className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { label: "Exams Taken", value: "12", color: "indigo" },
              { label: "Assignments Submitted", value: "28", color: "emerald" },
              { label: "Hours Studied", value: "156", color: "purple" },
              { label: "Improvement Rate", value: "+15%", color: "blue" },
            ].map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">{stat.label}</span>
                <span className={`font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Target className="text-amber-600 dark:text-amber-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recommendations
            </h3>
          </div>

          <div className="space-y-3">
            {[
              { text: "Focus more on History - lowest score", priority: "high" },
              { text: "Great progress in Computer Science!", priority: "success" },
              { text: "Review Chemistry fundamentals", priority: "medium" },
              { text: "Maintain current Math study routine", priority: "low" },
            ].map((rec, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-l-4 ${rec.priority === "high" ? "border-red-500 bg-red-50 dark:bg-red-900/20" :
                    rec.priority === "success" ? "border-green-500 bg-green-50 dark:bg-green-900/20" :
                      rec.priority === "medium" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" :
                        "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  }`}
              >
                <p className="text-sm text-gray-700 dark:text-gray-200">{rec.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* ---------------- KPI CARD ---------------- */
const KpiCard = ({ title, value, icon, color, trend, subtitle }) => {
  const colorClasses = {
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.startsWith('+') ? 'text-green-500' : trend.startsWith('-') ? 'text-red-500' : 'text-gray-500'}`}>
              {trend} from last period
            </p>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default Analytics;
