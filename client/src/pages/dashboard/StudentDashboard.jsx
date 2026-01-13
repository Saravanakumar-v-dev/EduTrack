import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  TrendingUp,
  BookOpen,
  CalendarCheck,
  Target,
  Award,
  Brain,
} from "lucide-react";

// Import new components
import StatCard from "../../components/cards/StatCard";
import SubjectCard from "../../components/cards/SubjectCard";
import PerformanceChart from "../../components/charts/PerformanceChart";
import BarChart from "../../components/charts/BarChart";
import RadarChart from "../../components/charts/RadarChart";
import WeakAreasPanel from "../../components/dashboard/WeakAreasPanel";
import AttendanceTracker from "../../components/dashboard/AttendanceTracker";
import RecentGrades from "../../components/dashboard/RecentGrades";
import AIInsights from "../../components/ai/AIInsights";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    overview: {
      overallAverage: 0,
      totalSubjects: 0,
      attendance: 0,
      rank: 0,
      trend: 0,
    },
    subjects: [],
    weakAreas: [],
    performanceTrend: [],
    subjectComparison: [],
    radarData: [],
    attendanceData: [],
    recentGrades: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In development, use mock data
      // In production, this would call the API
      const mockData = generateMockData();
      setDashboardData(mockData);
    } catch (error) {
      console.error("Failed to load dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock data for demonstration
  const generateMockData = () => {
    return {
      overview: {
        overallAverage: 78.5,
        totalSubjects: 6,
        attendance: 92,
        rank: 12,
        trend: 5.2,
      },
      subjects: [
        { name: "Mathematics", marks: 85, maxMarks: 100, trend: 3, grade: "A", color: "indigo" },
        { name: "Physics", marks: 78, maxMarks: 100, trend: -2, grade: "B+", color: "blue" },
        { name: "Chemistry", marks: 72, maxMarks: 100, trend: 5, grade: "B", color: "emerald" },
        { name: "English", marks: 88, maxMarks: 100, trend: 1, grade: "A", color: "purple" },
        { name: "Computer Science", marks: 92, maxMarks: 100, trend: 4, grade: "A+", color: "amber" },
        { name: "History", marks: 65, maxMarks: 100, trend: -3, grade: "C", color: "rose" },
      ],
      weakAreas: [
        {
          subject: "History",
          score: 65,
          topics: ["World War II", "Ancient Civilizations"],
          recommendation: "Review key dates and events, create timeline summaries"
        },
        {
          subject: "Physics",
          score: 78,
          topics: ["Thermodynamics", "Optics"],
          recommendation: "Practice numerical problems and diagram-based questions"
        },
      ],
      performanceTrend: [
        { name: "Jan", value: 72 },
        { name: "Feb", value: 75 },
        { name: "Mar", value: 74 },
        { name: "Apr", value: 77 },
        { name: "May", value: 79 },
        { name: "Jun", value: 78.5 },
      ],
      subjectComparison: [
        { name: "Math", value: 85 },
        { name: "Physics", value: 78 },
        { name: "Chemistry", value: 72 },
        { name: "English", value: 88 },
        { name: "CS", value: 92 },
        { name: "History", value: 65 },
      ],
      radarData: [
        { subject: "Math", value: 85 },
        { subject: "Physics", value: 78 },
        { subject: "Chemistry", value: 72 },
        { subject: "English", value: 88 },
        { subject: "CS", value: 92 },
        { subject: "History", value: 65 },
      ],
      attendanceData: [
        { date: "Mon, Jan 1", status: "present", subject: "Math" },
        { date: "Tue, Jan 2", status: "present", subject: "Physics" },
        { date: "Wed, Jan 3", status: "late", subject: "Chemistry" },
        { date: "Thu, Jan 4", status: "present", subject: "English" },
        { date: "Fri, Jan 5", status: "present", subject: "CS" },
        { date: "Mon, Jan 8", status: "absent", subject: "Math" },
        { date: "Tue, Jan 9", status: "present", subject: "Physics" },
      ],
      recentGrades: [
        {
          subject: "Computer Science",
          assessment: "Unit Test 3",
          marks: 46,
          maxMarks: 50,
          date: "Jan 5, 2024",
          trend: 4
        },
        {
          subject: "Mathematics",
          assessment: "Mid-term Exam",
          marks: 85,
          maxMarks: 100,
          date: "Jan 3, 2024",
          trend: 3
        },
        {
          subject: "English",
          assessment: "Essay Assignment",
          marks: 44,
          maxMarks: 50,
          date: "Dec 28, 2023",
          trend: 1
        },
      ],
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { overview, subjects, weakAreas, performanceTrend, subjectComparison, radarData, attendanceData, recentGrades } = dashboardData;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || "Student"}! 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
          Here's your academic performance overview
        </p>
      </motion.div>

      {/* OVERVIEW STATS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Overall Average"
          value={`${overview.overallAverage}%`}
          icon={<TrendingUp size={24} />}
          color="indigo"
          trend={overview.trend}
          subtitle="Last 6 months"
        />
        <StatCard
          title="Total Subjects"
          value={overview.totalSubjects}
          icon={<BookOpen size={24} />}
          color="emerald"
          subtitle="This semester"
        />
        <StatCard
          title="Attendance"
          value={`${overview.attendance}%`}
          icon={<CalendarCheck size={24} />}
          color="amber"
          subtitle="This month"
        />
        <StatCard
          title="Class Rank"
          value={`#${overview.rank}`}
          icon={<Award size={24} />}
          color="purple"
          subtitle="Out of 120 students"
        />
      </motion.div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart
          data={performanceTrend}
          title="Performance Trend"
          type="area"
          color="#4f46e5"
        />
        <BarChart
          data={subjectComparison}
          title="Subject-wise Comparison"
          colors={['#4f46e5', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']}
        />
      </div>

      {/* SUBJECTS GRID */}
      <div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"
        >
          <BookOpen className="text-indigo-600 dark:text-indigo-400" />
          Subject Performance
        </motion.h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <SubjectCard
              key={index}
              subject={subject}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>

      {/* RADAR CHART & WEAK AREAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RadarChart data={radarData} title="Skills Assessment" />
        <WeakAreasPanel weakAreas={weakAreas} />
      </div>

      {/* ATTENDANCE & RECENT GRADES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceTracker attendanceData={attendanceData} />
        <RecentGrades grades={recentGrades} />
      </div>

      {/* AI INSIGHTS */}
      <AIInsights studentData={overview} />
    </div>
  );
};

export default StudentDashboard;
