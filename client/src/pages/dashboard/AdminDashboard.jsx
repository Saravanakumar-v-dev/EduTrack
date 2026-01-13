import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Shield,
  Activity,
  FileText,
  Settings,
} from "lucide-react";

import StatCard from "../../components/cards/StatCard";
import BarChart from "../../components/charts/BarChart";
import PerformanceChart from "../../components/charts/PerformanceChart";
import LoadingSkeleton from "../../components/common/LoadingSkeleton";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalStudents: 0,
      totalTeachers: 0,
      totalDepartments: 0,
      averagePerformance: 0,
      trend: 0,
    },
    departmentStats: [],
    enrollmentTrend: [],
    recentActivities: [],
    systemHealth: {
      status: "operational",
      uptime: "99.9%",
    },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const mockData = generateMockAdminData();
      setDashboardData(mockData);
    } catch (error) {
      console.error("Failed to load admin dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAdminData = () => {
    return {
      overview: {
        totalStudents: 1247,
        totalTeachers: 89,
        totalDepartments: 12,
        averagePerformance: 76.8,
        trend: 2.5,
      },
      departmentStats: [
        { name: "Computer Science", value: 245 },
        { name: "Mathematics", value: 198 },
        { name: "Physics", value: 187 },
        { name: "Chemistry", value: 165 },
        { name: "English", value: 142 },
        { name: "History", value: 110 },
      ],
      enrollmentTrend: [
        { name: "2019", value: 980 },
        { name: "2020", value: 1050 },
        { name: "2021", value: 1120 },
        { name: "2022", value: 1185 },
        { name: "2023", value: 1210 },
        { name: "2024", value: 1247 },
      ],
      recentActivities: [
        {
          type: "user",
          description: "New teacher registered: Dr. Sarah Williams",
          time: "10 mins ago",
        },
        {
          type: "system",
          description: "Database backup completed successfully",
          time: "1 hour ago",
        },
        {
          type: "report",
          description: "Monthly performance report generated",
          time: "3 hours ago",
        },
        {
          type: "user",
          description: "15 new students enrolled",
          time: "5 hours ago",
        },
      ],
      systemHealth: {
        status: "operational",
        uptime: "99.9%",
        lastBackup: "2 hours ago",
      },
    };
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  const { overview, departmentStats, enrollmentTrend, recentActivities, systemHealth } = dashboardData;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard 🛠️
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
          System-wide analytics and management
        </p>
      </motion.div>

      {/* SYSTEM STATUS BANNER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl shadow-lg ${systemHealth.status === 'operational'
          ? 'bg-gradient-to-r from-green-500 to-emerald-600'
          : 'bg-gradient-to-r from-red-500 to-rose-600'
          } text-white`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield size={32} />
            <div>
              <h3 className="text-2xl font-bold">System Status</h3>
              <p className="text-white/90">All systems {systemHealth.status}</p>
            </div>
          </div>
          <div className="flex gap-8 text-right">
            <div>
              <div className="text-3xl font-bold">{systemHealth.uptime}</div>
              <div className="text-sm text-white/80">Uptime</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{systemHealth.lastBackup}</div>
              <div className="text-sm text-white/80">Last Backup</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* OVERVIEW STATS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Students"
          value={overview.totalStudents.toLocaleString()}
          icon={<GraduationCap size={24} />}
          color="indigo"
          subtitle="Active enrollments"
        />
        <StatCard
          title="Total Teachers"
          value={overview.totalTeachers}
          icon={<Users size={24} />}
          color="emerald"
          subtitle="Faculty members"
        />
        <StatCard
          title="Departments"
          value={overview.totalDepartments}
          icon={<BookOpen size={24} />}
          color="purple"
          subtitle="Academic divisions"
        />
        <StatCard
          title="Avg. Performance"
          value={`${overview.averagePerformance}%`}
          icon={<TrendingUp size={24} />}
          color="blue"
          trend={overview.trend}
          subtitle="Institution-wide"
        />
      </motion.div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={departmentStats}
          title="Students by Department"
          colors={['#4f46e5', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']}
        />
        <PerformanceChart
          data={enrollmentTrend}
          title="Enrollment Growth"
          type="area"
          color="#10b981"
        />
      </div>

      {/* MANAGEMENT PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Users className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
          </div>

          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors text-left flex items-center justify-between">
              <span>Manage Students</span>
              <span className="text-sm bg-indigo-200 px-2 py-1 rounded">
                {overview.totalStudents}
              </span>
            </button>
            <button className="w-full px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors text-left flex items-center justify-between">
              <span>Manage Teachers</span>
              <span className="text-sm bg-emerald-200 px-2 py-1 rounded">
                {overview.totalTeachers}
              </span>
            </button>
            <button className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors text-left">
              Manage Admins
            </button>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Activity className="text-purple-600 dark:text-purple-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'system' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.description}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Settings className="text-amber-600 dark:text-amber-400" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/reports')}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              📊 Generate Reports
            </button>
            <button
              onClick={() => navigate('/assignments')}
              className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105"
            >
              📝 Manage Assignments
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-full px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-medium hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105"
            >
              ⚙️ System Settings
            </button>
          </div>
        </motion.div>
      </div>

      {/* AUDIT LOGS SECTION */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FileText className="text-blue-600 dark:text-blue-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audit Logs</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track all system activities</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            View All Logs
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: "10:45 AM", user: "admin@edutrack.com", action: "User Created", details: "New teacher account", status: "success" },
                { time: "10:30 AM", user: "system", action: "Backup", details: "Database backup", status: "success" },
                { time: "09:15 AM", user: "admin@edutrack.com", action: "Report Generated", details: "Monthly analytics", status: "success" },
              ].map((log, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{log.time}</td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{log.user}</td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{log.action}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{log.details}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.status === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
