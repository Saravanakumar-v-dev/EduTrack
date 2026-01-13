import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'dashboard' }) => {
    if (type === 'statCard') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="flex items-start justify-between">
                    <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                    <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
            </div>
        );
    }

    if (type === 'chart') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="space-y-3">
                    <div className="h-64 bg-gray-100 rounded"></div>
                </div>
            </div>
        );
    }

    if (type === 'subjectCard') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-2 bg-gray-300"></div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Full dashboard loading
    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="space-y-2 animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-96"></div>
                <div className="h-6 bg-gray-200 rounded w-64"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <LoadingSkeleton type="statCard" />
                    </motion.div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                    >
                        <LoadingSkeleton type="chart" />
                    </motion.div>
                ))}
            </div>

            {/* Subject Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.05 }}
                    >
                        <LoadingSkeleton type="subjectCard" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default LoadingSkeleton;
