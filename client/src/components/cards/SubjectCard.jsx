import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BookOpen } from 'lucide-react';

const SubjectCard = ({ subject, delay = 0 }) => {
    const { name, marks, maxMarks, trend, grade, color = 'indigo' } = subject;

    const percentage = maxMarks > 0 ? ((marks / maxMarks) * 100).toFixed(1) : 0;
    const isGood = percentage >= 60;

    const colorMap = {
        indigo: 'from-indigo-500 to-indigo-600',
        emerald: 'from-emerald-500 to-emerald-600',
        amber: 'from-amber-500 to-amber-600',
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        rose: 'from-rose-500 to-rose-600'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group"
        >
            {/* Gradient Header */}
            <div className={`h-2 bg-gradient-to-r ${colorMap[color] || colorMap.indigo}`} />

            <div className="p-6">
                {/* Subject Icon & Name */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white shadow-lg`}>
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{name || "Subject"}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{grade || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Trend Indicator */}
                    {trend && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: delay + 0.2, type: 'spring' }}
                            className={`flex items-center gap-1 p-2 rounded-lg ${trend > 0
                                ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                }`}
                        >
                            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            <span className="text-sm font-semibold">{Math.abs(trend)}%</span>
                        </motion.div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                    <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Performance</span>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
                    </div>

                    <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
                            className={`h-full bg-gradient-to-r ${colorMap[color]} rounded-full`}
                        />
                    </div>
                </div>

                {/* Marks Display */}
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Marks Obtained</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {marks} / {maxMarks}
                    </span>
                </div>

                {/* Status Badge */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isGood
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                            : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
                            }`}
                    >
                        {isGood ? '✓ Good Performance' : '⚠ Needs Improvement'}
                    </span>
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </motion.div>
    );
};

export default SubjectCard;
