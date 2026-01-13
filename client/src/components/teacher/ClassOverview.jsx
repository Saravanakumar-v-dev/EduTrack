import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Users, Award, AlertTriangle } from 'lucide-react';

const ClassOverview = ({ classData }) => {
    const {
        className = "Class 10-A",
        totalStudents = 0,
        averageScore = 0,
        topPerformers = [],
        weakPerformers = [],
        attendanceRate = 0,
        trend = 0
    } = classData || {};

    const getStatusColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-amber-600';
        return 'text-red-600';
    };

    return (
        <div className="space-y-6">
            {/* Class Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-8 text-white"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{className}</h2>
                        <p className="text-indigo-100">Class Performance Overview</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        {trend >= 0 ? (
                            <TrendingUp className="text-green-300" />
                        ) : (
                            <TrendingDown className="text-red-300" />
                        )}
                        <span className="font-bold text-lg">{Math.abs(trend)}%</span>
                    </div>
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-3 gap-6 mt-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <Users size={24} className="mb-2" />
                        <div className="text-3xl font-bold">{totalStudents}</div>
                        <div className="text-sm text-emerald-100">Students</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <Award size={24} className="mb-2" />
                        <div className="text-3xl font-bold">{averageScore}%</div>
                        <div className="text-sm text-emerald-100">Class Average</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                        <TrendingUp size={24} className="mb-2" />
                        <div className="text-3xl font-bold">{attendanceRate}%</div>
                        <div className="text-sm text-emerald-100">Attendance</div>
                    </div>
                </div>
            </motion.div>

            {/* Top & Weak Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Performers */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                            <Award className="text-green-600 dark:text-green-400" size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performers</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Excellent students</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {topPerformers.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No data available</p>
                        ) : (
                            topPerformers.map((student, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{student.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{student.id}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{student.score}%</div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Weak Performers */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                            <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Needs Attention</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Students at risk</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {weakPerformers.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No students at risk</p>
                        ) : (
                            weakPerformers.map((student, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-100 dark:border-red-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm">
                                            !
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{student.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{student.id}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{student.score}%</div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ClassOverview;
