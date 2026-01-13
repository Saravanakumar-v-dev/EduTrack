import { motion } from 'framer-motion';

const ProgressBar = ({
    value,
    max = 100,
    color = 'indigo',
    showLabel = true,
    size = 'md',
    animated = true
}) => {
    const percentage = (value / max) * 100;

    const sizeClasses = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
    };

    const colorClasses = {
        indigo: 'bg-indigo-600',
        green: 'bg-green-600',
        blue: 'bg-blue-600',
        amber: 'bg-amber-600',
        red: 'bg-red-600',
        purple: 'bg-purple-600',
    };

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {Math.round(percentage)}%
                    </span>
                </div>
            )}

            <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
                <motion.div
                    initial={{ width: animated ? 0 : `${percentage}%` }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full`}
                />
            </div>
        </div>
    );
};

export default ProgressBar;
