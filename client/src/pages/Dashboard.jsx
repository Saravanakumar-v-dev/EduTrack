import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Users, TrendingUp, AlertTriangle, ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- MOCK/PLACEHOLDER IMPORTS ---
// Mock imported components (will be created later)
const PerformanceChart = ({ title }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-96 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 font-semibold">{title} Chart Placeholder (Chart.js/Recharts)</p>
    </div>
);
const StatCard = ({ title, value, icon: Icon, colorClass, link, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border-b-4 border-l-2"
        style={{ borderColor: colorClass.includes('indigo') ? '#6366f1' : colorClass.includes('green') ? '#10b981' : colorClass.includes('red') ? '#ef4444' : '#f59e0b', borderBottomWidth: '6px' }}
    >
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${colorClass.replace('text-', 'bg-').replace('-600', '-100')} dark:${colorClass.replace('text-', 'bg-').replace('-600', '-900')}`}>
                <Icon className={`w-6 h-6 ${colorClass}`} />
            </div>
        </div>
        {link && (
            <Link to={link} className="mt-4 flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition duration-200">
                View Details
                <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
        )}
    </motion.div>
);

// Mock Auth Context to get user details (role is handled by ProtectedRoute, but name is useful)
const AuthContext = React.createContext({
    user: { name: 'Dr. Jane Doe', role: 'teacher' },
});
// --- END MOCK/PLACEHOLDER IMPORTS ---

/**
 * Dashboard Page for Teachers/Admins.
 * Provides quick stats, charts, and key actions.
 */
const Dashboard = () => {
    const { user } = useContext(AuthContext);

    // Mock Data for the Dashboard
    const totalStudents = 150;
    const avgGrade = 'B+ (85%)';
    const weakStudents = 15;
    const pendingReports = 3;

    // Data for the Stat Cards
    const stats = [
        { title: "Total Students", value: totalStudents, icon: Users, color: 'text-indigo-600', link: '/admin' },
        { title: "Average Class Grade", value: avgGrade, icon: TrendingUp, color: 'text-green-600', link: '/analytics' },
        { title: "Students at Risk", value: weakStudents, icon: AlertTriangle, color: 'text-red-600', link: '/analytics' },
        { title: "Pending Reports", value: pendingReports, icon: FileText, color: 'text-yellow-600', link: '/reports' },
    ];

    // Animation variant for section headers
    const headerVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        <div className="space-y-10">
            {/* Header and Welcome */}
            <motion.header
                initial="hidden"
                animate="visible"
                variants={headerVariants}
                className="pb-4 border-b border-gray-200 dark:border-gray-700"
            >
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                    Hello, {user?.name || 'Teacher'}!
                </h1>
                <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                    Your central hub for performance analytics.
                </p>
            </motion.header>

            {/* Quick Actions Card */}
            <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-indigo-50 dark:bg-indigo-950 p-6 rounded-2xl shadow-xl border border-indigo-200 dark:border-indigo-700"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">
                            Ready to Upload New Data?
                        </h2>
                        <p className="mt-1 text-indigo-600 dark:text-indigo-400">
                            Quickly update student grades, attendance, or scores via CSV/XLSX.
                        </p>
                    </div>
                    <Link to="/admin">
                        <motion.button
                            whileHover={{ y: -3 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform"
                        >
                            <UploadCloud className="w-5 h-5 mr-2" />
                            Upload File
                        </motion.button>
                    </Link>
                </div>
            </motion.section>


            {/* Key Statistics Grid */}
            <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
            >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Key Metrics Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard 
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            colorClass={stat.color}
                            link={stat.link}
                        />
                    ))}
                </div>
            </motion.section>

            {/* Performance Charts Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-4"
            >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Visual Analytics
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PerformanceChart title="Overall Class Grade Distribution" />
                    <PerformanceChart title="Attendance Trend (Last 30 Days)" />
                    <div className="lg:col-span-2">
                        <PerformanceChart title="Top 5 Weakest Subjects/Areas" />
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default Dashboard;