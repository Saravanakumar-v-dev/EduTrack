import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, Target, Lightbulb } from 'lucide-react';
import { useState } from 'react';

const AIInsights = ({ studentData }) => {
    const [loading, setLoading] = useState(false);
    const [insights, setInsights] = useState(null);

    const generateInsights = async () => {
        setLoading(true);

        // Simulate AI generation
        setTimeout(() => {
            setInsights({
                performance: {
                    trend: studentData?.averageScore >= 75 ? 'improving' : 'needs_attention',
                    message: studentData?.averageScore >= 75
                        ? 'Your performance shows consistent improvement across subjects!'
                        : 'Some subjects need more attention to improve overall performance.',
                },
                recommendations: [
                    {
                        subject: 'Mathematics',
                        priority: 'high',
                        suggestion: 'Focus on practicing more numerical problems, especially in calculus. Allocate 30 minutes daily.',
                        icon: TrendingUp,
                    },
                    {
                        subject: 'Physics',
                        priority: 'medium',
                        suggestion: 'Review conceptual topics and formula derivations. Create summary notes for each chapter.',
                        icon: Lightbulb,
                    },
                    {
                        subject: 'Study Strategy',
                        priority: 'high',
                        suggestion: 'Implement the Pomodoro technique: 25 minutes focused study, 5 minutes break.',
                        icon: Target,
                    },
                ],
                predictions: {
                    nextExam: {
                        subject: 'Mathematics',
                        predicted: 87,
                        confidence: 85,
                    },
                    overallTrend: 'upward',
                },
            });
            setLoading(false);
        }, 2000);
    };

    if (!insights) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-8 text-center"
            >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Brain size={40} className="text-white" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    AI-Powered Insights
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Get personalized recommendations and performance predictions based on your academic history
                </p>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateInsights}
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating Insights...
                        </>
                    ) : (
                        <>
                            <Sparkles size={20} />
                            Generate AI Insights
                        </>
                    )}
                </motion.button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Performance Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl shadow-lg p-6 ${insights.performance.trend === 'improving'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600'
                    } text-white`}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Brain size={24} />
                            <h3 className="text-xl font-bold">Performance Analysis</h3>
                        </div>
                        <p className="text-white/90">{insights.performance.message}</p>
                    </div>
                    <Sparkles size={32} className="opacity-50" />
                </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="text-amber-500" />
                    Personalized Recommendations
                </h3>

                <div className="space-y-4">
                    {insights.recommendations.map((rec, index) => {
                        const Icon = rec.icon;
                        const priorityColors = {
                            high: 'border-red-200 bg-red-50',
                            medium: 'border-amber-200 bg-amber-50',
                            low: 'border-blue-200 bg-blue-50',
                        };

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className={`p-4 rounded-xl border-2 ${priorityColors[rec.priority]}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${rec.priority === 'high' ? 'bg-red-200 text-red-700' :
                                        rec.priority === 'medium' ? 'bg-amber-200 text-amber-700' :
                                            'bg-blue-200 text-blue-700'
                                        }`}>
                                        <Icon size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-gray-900">{rec.subject}</h4>
                                            <span className={`text-xs font-medium px-2 py-1 rounded ${rec.priority === 'high' ? 'bg-red-200 text-red-700' :
                                                rec.priority === 'medium' ? 'bg-amber-200 text-amber-700' :
                                                    'bg-blue-200 text-blue-700'
                                                }`}>
                                                {rec.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700">{rec.suggestion}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Performance Prediction */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6"
            >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="text-indigo-600" />
                    Performance Prediction
                </h3>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Next Exam: {insights.predictions.nextExam.subject}</span>
                        <span className="text-sm text-gray-500">
                            {insights.predictions.nextExam.confidence}% confidence
                        </span>
                    </div>

                    <div className="flex items-end gap-4">
                        <div className="text-4xl font-bold text-indigo-600">
                            {insights.predictions.nextExam.predicted}%
                        </div>
                        <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${insights.predictions.nextExam.predicted}%` }}
                                    transition={{ duration: 1, delay: 0.6 }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setInsights(null)}
                    className="w-full mt-4 px-4 py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-700 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Generate New Insights
                </button>
            </motion.div>
        </div>
    );
};

export default AIInsights;
