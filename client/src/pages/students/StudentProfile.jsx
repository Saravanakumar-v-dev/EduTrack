import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Award,
  TrendingUp,
  BookOpen,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const StudentProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Mock profile data
  const [profile, setProfile] = useState({
    name: user?.name || "Student",
    email: user?.email || "student@edutrack.com",
    phone: user?.phone || "N/A",
    className: "Class 10-A",
    rollNumber: "ST2024001",
    joinedDate: "August 2023",
    subjects: 6,
    attendance: 92,
    rank: 12,
    grade: "A",
  });

  const [performanceTrend, setPerformanceTrend] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setPerformanceTrend([
        { exam: "Unit 1", marks: 72 },
        { exam: "Unit 2", marks: 78 },
        { exam: "Midterm", marks: 82 },
        { exam: "Unit 3", marks: 85 },
        { exam: "Unit 4", marks: 80 },
        { exam: "Final", marks: 88 },
      ]);

      setRecentGrades([
        { subject: "Mathematics", marks: 85, grade: "A", color: "indigo" },
        { subject: "Physics", marks: 78, grade: "B+", color: "blue" },
        { subject: "Chemistry", marks: 72, grade: "B", color: "emerald" },
        { subject: "English", marks: 88, grade: "A", color: "purple" },
        { subject: "Computer Science", marks: 92, grade: "A+", color: "amber" },
      ]);

      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Profile 👤</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
          View your academic information and performance
        </p>
      </motion.div>

      {/* PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-lg p-8 text-white"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold border-4 border-white/30">
            {profile.name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/90">
              <span className="flex items-center gap-2">
                <Mail size={16} /> {profile.email}
              </span>
              <span className="flex items-center gap-2">
                <GraduationCap size={16} /> {profile.className}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} /> Joined {profile.joinedDate}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">{profile.attendance}%</div>
              <div className="text-sm text-white/80">Attendance</div>
            </div>
            <div>
              <div className="text-3xl font-bold">#{profile.rank}</div>
              <div className="text-sm text-white/80">Class Rank</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{profile.grade}</div>
              <div className="text-sm text-white/80">Overall</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS CARDS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <StatCard
          icon={<BookOpen size={24} />}
          title="Subjects"
          value={profile.subjects}
          color="indigo"
        />
        <StatCard
          icon={<Award size={24} />}
          title="Overall Grade"
          value={profile.grade}
          color="emerald"
        />
        <StatCard
          icon={<TrendingUp size={24} />}
          title="Class Rank"
          value={`#${profile.rank}`}
          color="purple"
        />
        <StatCard
          icon={<Clock size={24} />}
          title="Attendance"
          value={`${profile.attendance}%`}
          color="blue"
        />
      </motion.div>

      {/* CHARTS & GRADES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <TrendingUp className="text-indigo-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Performance Trend
            </h3>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="exam" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="marks"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ fill: "#4f46e5", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Grades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Award className="text-emerald-600" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Subject Grades
            </h3>
          </div>

          <div className="space-y-4">
            {recentGrades.map((grade, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-10 rounded-full bg-${grade.color}-500`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{grade.subject}</p>
                    <p className="text-sm text-gray-500">{grade.marks}/100</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${grade.grade.includes("A") ? "bg-green-100 text-green-700" :
                  grade.grade.includes("B") ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                  {grade.grade}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ATTENDANCE BREAKDOWN */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Calendar className="text-purple-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Attendance Breakdown
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-3xl font-bold text-green-600">92%</div>
            <div className="text-sm text-gray-600 mt-1">Present</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <div className="text-3xl font-bold text-red-600">5%</div>
            <div className="text-sm text-gray-600 mt-1">Absent</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="text-3xl font-bold text-yellow-600">3%</div>
            <div className="text-sm text-gray-600 mt-1">Late</div>
          </div>
        </div>
      </motion.div>
    </div >
  );
};

/* ---------- STAT CARD ---------- */
const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StudentProfile;
