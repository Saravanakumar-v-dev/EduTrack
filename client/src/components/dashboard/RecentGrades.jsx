import { motion } from 'framer-motion';
import { Award, TrendingUp, Calendar } from 'lucide-react';

const RecentGrades = ({ grades = [] }) => {
    const getGradeColor = (percentage) => {
        if (percentage >= 90) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
        if (percentage >= 75) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
        if (percentage >= 60) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
    };

    const getGradeLetter = (percentage) => {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 50) return 'D';
        return 'F';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Award className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Assessments</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your latest results</p>
                </div>
            </div>

            {grades.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No recent assessments</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {grades.map((grade, index) => {
                        const percentage = ((grade.marks / grade.maxMarks) * 100).toFixed(1);

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="relative p-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{grade.subject}</h4>
                                            {grade.trend && (
                                                <TrendingUp
                                                    size={14}
                                                    className={grade.trend > 0 ? 'text-green-500' : 'text-red-500'}
                                                    style={{ transform: grade.trend < 0 ? 'rotate(180deg)' : 'none' }}
                                                />
                                            )}
                                        </div>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{grade.assessment}</p>

                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                                <Calendar size={14} />
                                                <span>{grade.date}</span>
                                            </div>
                                            <span className="text-gray-400 dark:text-gray-500">•</span>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {grade.marks} / {grade.maxMarks} marks
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                                            className={`px-4 py-2 rounded-lg border-2 font-bold ${getGradeColor(percentage)}`}
                                        >
                                            {getGradeLetter(percentage)}
                                        </motion.div>
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-3 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                                        className={`h-full rounded-full ${percentage >= 75 ? 'bg-green-500' :
                                            percentage >= 60 ? 'bg-blue-500' :
                                                'bg-red-500'
                                            }`}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
};

export default RecentGrades;
