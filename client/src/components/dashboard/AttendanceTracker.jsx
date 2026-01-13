import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const AttendanceTracker = ({ attendanceData = [] }) => {
    // Calculate attendance percentage
    const totalDays = attendanceData.length;
    const presentDays = attendanceData.filter(d => d.status === 'present').length;
    const attendancePercentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : 0;

    // Get last 7 days
    const recentDays = attendanceData.slice(-7).reverse();

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-500';
            case 'absent': return 'bg-red-500';
            case 'late': return 'bg-amber-500';
            default: return 'bg-gray-300';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'present': return <CheckCircle size={16} />;
            case 'absent': return <XCircle size={16} />;
            case 'late': return <Clock size={16} />;
            default: return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Tracker</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last 7 days</p>
                </div>
            </div>

            {/* Attendance Percentage Circle */}
            <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200 dark:text-gray-700"
                        />
                        <motion.circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 56}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - attendancePercentage / 100) }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className={
                                attendancePercentage >= 75 ? 'text-green-500' :
                                    attendancePercentage >= 50 ? 'text-amber-500' :
                                        'text-red-500'
                            }
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: 'spring' }}
                                className="text-3xl font-bold text-gray-900 dark:text-white"
                            >
                                {attendancePercentage}%
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Days */}
            <div className="space-y-2">
                {recentDays.map((day, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${getStatusColor(day.status)} flex items-center justify-center text-white`}>
                                {getStatusIcon(day.status)}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{day.date}</p>
                                {day.subject && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{day.subject}</p>
                                )}
                            </div>
                        </div>
                        <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-300">
                            {day.status}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Stats Summary */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{presentDays}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Present</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {attendanceData.filter(d => d.status === 'absent').length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Absent</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {attendanceData.filter(d => d.status === 'late').length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Late</div>
                </div>
            </div>
        </motion.div>
    );
};

export default AttendanceTracker;
