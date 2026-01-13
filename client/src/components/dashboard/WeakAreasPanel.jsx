import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Target } from 'lucide-react';

const WeakAreasPanel = ({ weakAreas = [] }) => {
    if (weakAreas.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Target className="text-green-600 dark:text-green-400" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Areas to Improve</h3>
                </div>
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">Great job! No weak areas identified</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Keep up the good work!</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Areas to Improve</h3>
            </div>

            <div className="space-y-3">
                {weakAreas.map((area, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ x: 4 }}
                        className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border border-red-100 dark:border-red-800 hover:border-red-200 dark:hover:border-red-700 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                            <TrendingDown className="text-red-600 dark:text-red-400" size={16} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">{area.subject}</h4>
                                <span className="text-sm font-medium text-red-600 dark:text-red-400">{area.score}%</span>
                            </div>

                            {area.topics && area.topics.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {area.topics.map((topic, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center px-2 py-0.5 rounded-md bg-white dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {area.recommendation && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                                    💡 {area.recommendation}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {weakAreas.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800"
                >
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Tip:</strong> Focus on these areas to improve your overall performance
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default WeakAreasPanel;
