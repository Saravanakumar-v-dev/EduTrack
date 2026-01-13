import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors duration-300"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <motion.div
                animate={{
                    x: isDark ? 28 : 0,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
            >
                {isDark ? (
                    <Moon size={12} className="text-indigo-600" />
                ) : (
                    <Sun size={12} className="text-amber-500" />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
