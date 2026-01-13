import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color = 'indigo', trend, subtitle }) => {
    const colorMap = {
        indigo: {
            bg: 'bg-indigo-50 dark:bg-indigo-900/30',
            text: 'text-indigo-600 dark:text-indigo-400',
            gradient: 'from-indigo-500 to-indigo-600'
        },
        emerald: {
            bg: 'bg-emerald-50 dark:bg-emerald-900/30',
            text: 'text-emerald-600 dark:text-emerald-400',
            gradient: 'from-emerald-500 to-emerald-600'
        },
        amber: {
            bg: 'bg-amber-50 dark:bg-amber-900/30',
            text: 'text-amber-600 dark:text-amber-400',
            gradient: 'from-amber-500 to-amber-600'
        },
        purple: {
            bg: 'bg-purple-50 dark:bg-purple-900/30',
            text: 'text-purple-600 dark:text-purple-400',
            gradient: 'from-purple-500 to-purple-600'
        },
        blue: {
            bg: 'bg-blue-50 dark:bg-blue-900/30',
            text: 'text-blue-600 dark:text-blue-400',
            gradient: 'from-blue-500 to-blue-600'
        },
        red: {
            bg: 'bg-red-50 dark:bg-red-900/30',
            text: 'text-red-600 dark:text-red-400',
            gradient: 'from-red-500 to-red-600'
        },
        green: {
            bg: 'bg-green-50 dark:bg-green-900/30',
            text: 'text-green-600 dark:text-green-400',
            gradient: 'from-green-500 to-green-600'
        }
    };

    const colors = colorMap[color] || colorMap.indigo;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group"
        >
            {/* Background Gradient Effect */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`} />

            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text} group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>

                    {trend && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${trend > 0
                                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                                : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
                                }`}
                        >
                            {trend > 0 ? '+' : ''}{trend}%
                        </motion.div>
                    )}
                </div>

                <div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-gray-600 dark:text-gray-400 mb-1"
                    >
                        {title || "Stat Title"}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
                    >
                        {value || "N/A"}
                    </motion.p>

                    {subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
