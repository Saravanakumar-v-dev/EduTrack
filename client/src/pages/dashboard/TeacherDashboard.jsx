import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

// Import components
import StatCard from "../../components/cards/StatCard";
import ClassOverview from "../../components/teacher/ClassOverview";
import StudentList from "../../components/teacher/StudentList";
import BarChart from "../../components/charts/BarChart";
import PerformanceChart from "../../components/charts/PerformanceChart";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalClasses: 0,
      totalStudents: 0,
      averageScore: 0,
      atRiskCount: 0,
      attendanceRate: 0,
      trend: 0,
    },
    classData: {},
    students: [],
    performanceTrend: [],
    gradeDistribution: [],
    recentActivities: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Using mock data for demonstration
      const mockData = generateMockTeacherData();
      setDashboardData(mockData);
    } catch (error) {
      console.error("Failed to load teacher dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTeacherData = () => {
    return {
      overview: {
        totalClasses: 3,
        totalStudents: 85,
        averageScore: 74.5,
        atRiskCount: 12,
        attendanceRate: 88,
        trend: 3.2,
      },
      classData: {
        className: "Class 10-A (Mathematics)",
        totalStudents: 30,
        averageScore: 76,
        attendanceRate: 90,
        trend: 4.5,
        topPerformers: [
          { name: "Alice Johnson", id: "S2024001", score: 95 },
          { name: "Bob Smith", id: "S2024002", score: 92 },
          { name: "Carol White", id: "S2024003", score: 89 },
        ],
        weakPerformers: [
          { name: "David Brown", id: "S2024028", score: 45 },
          { name: "Emma Davis", id: "S2024029", score: 52 },
          { name: "Frank Wilson", id: "S2024030", score: 58 },
        ],
      },
      students: [
        { id: "S2024001", name: "Alice Johnson", class: "10-A", average: 95, trend: 5 },
        { id: "S2024002", name: "Bob Smith", class: "10-A", average: 92, trend: 3 },
        { id: "S2024003", name: "Carol White", class: "10-A", average: 89, trend: 2 },
        { id: "S2024004", name: "David Brown", class: "10-B", average: 45, trend: -3 },
        { id: "S2024005", name: "Emma Davis", class: "10-B", average: 52, trend: -1 },
        { id: "S2024006", name: "Frank Wilson", class: "10-C", average: 58, trend: 1 },
        { id: "S2024007", name: "Grace Lee", class: "10-A", average: 87, trend: 4 },
        { id: "S2024008", name: "Henry Chen", class: "10-B", average: 78, trend: 2 },
      ],
      performanceTrend: [
        { name: "Week 1", value: 70 },
        { name: "Week 2", value: 72 },
        { name: "Week 3", value: 71 },
        { name: "Week 4", value: 75 },
        { name: "Week 5", value: 74.5 },
      ],
      gradeDistribution: [
        { name: "A (90-100)", value: 8 },
        { name: "B (80-89)", value: 15 },
        { name: "C (70-79)", value: 22 },
        { name: "D (60-69)", value: 18 },
        { name: "F (<60)", value: 12 },
      ],
      recentActivities: [
        {
          type: "marks",
          description: "Updated marks for Mathematics Unit Test 3",
          time: "2 hours ago",
        },
        {
          type: "attendance",
          description: "Marked attendance for Class 10-A",
          time: "5 hours ago",
        },
        {
          type: "assignment",
          description: "Created new assignment: Algebra Chapter 5",
          time: "1 day ago",
        },
      ],
    };
  };

  const handleStudentSelect = (student) => {
    console.log("Selected student:", student);
    // Navigate to student detail page or show modal
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  const { overview, classData, students, performanceTrend, gradeDistribution, recentActivities } = dashboardData;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome, Prof. {user?.name}! 👨‍🏫
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
          Manage your classes and track student performance
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
          title="Total Classes"
          value={overview.totalClasses}
          icon={<BookOpen size={24} />}
          color="indigo"
          subtitle="Active classes"
        />
        <StatCard
          title="Total Students"
          value={overview.totalStudents}
          icon={<Users size={24} />}
          color="emerald"
          subtitle="Across all classes"
        />
        <StatCard
          title="Class Average"
          value={`${overview.averageScore}%`}
          icon={<TrendingUp size={24} />}
          color="blue"
          trend={overview.trend}
          subtitle="Overall performance"
        />
        <StatCard
          title="At-Risk Students"
          value={overview.atRiskCount}
          icon={<AlertTriangle size={24} />}
          color="red"
          subtitle="Need attention"
        />
      </motion.div>

      {/* CLASS OVERVIEW */}
      <ClassOverview classData={classData} />

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart
          data={performanceTrend}
          title="Class Performance Trend"
          type="area"
          color="#4f46e5"
        />
        <BarChart
          data={gradeDistribution}
          title="Grade Distribution"
          colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#991b1b']}
        />
      </div>

      {/* STUDENT LIST & RECENT ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StudentList
            students={students}
            onSelectStudent={handleStudentSelect}
          />
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
              <Clock className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your latest actions</p>
            </div>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.type === 'marks' ? 'bg-blue-100 dark:bg-blue-900/50' :
                  activity.type === 'attendance' ? 'bg-green-100 dark:bg-green-900/50' :
                    'bg-purple-100 dark:bg-purple-900/50'
                  }`}>
                  <CheckCircle
                    size={16}
                    className={
                      activity.type === 'marks' ? 'text-blue-600 dark:text-blue-400' :
                        activity.type === 'attendance' ? 'text-green-600 dark:text-green-400' :
                          'text-purple-600 dark:text-purple-400'
                    }
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            View All Activities
          </button>
        </motion.div>
      </div>

      {/* QUICK ACTIONS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-8 text-white"
      >
        <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/profile#attendance')}
            className="px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all hover:scale-105 transform"
          >
            📝 Mark Attendance
          </button>
          <button
            onClick={() => navigate('/profile#marks')}
            className="px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all hover:scale-105 transform"
          >
            ✍️ Upload Marks
          </button>
          <button
            onClick={() => navigate('/profile#reports')}
            className="px-6 py-4 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all hover:scale-105 transform"
          >
            📊 Generate Report
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
