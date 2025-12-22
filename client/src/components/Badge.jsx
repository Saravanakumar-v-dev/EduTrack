import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, CheckCircle, Target } from 'lucide-react';

/**
 * A reusable component to display an individual student achievement badge.
 * It uses Framer Motion for a subtle interactive hover effect.
 *
 * @param {string} title - The title of the badge (e.g., "Perfect Attendance").
 * @param {string} description - A brief description of the achievement.
 * @param {string} iconType - The type of icon to display ('attendance', 'speed', 'excellence', 'target').
 * @param {string} color - Tailwind color class for the badge (e.g., 'text-green-500').
 */
const Badge = ({ title, description, iconType, color = 'text-indigo-500' }) => {
  // Function to select the appropriate Lucide icon based on iconType
  const getIcon = (type) => {
    switch (type) {
      case 'attendance':
        return <CheckCircle className={`w-6 h-6 ${color}`} />;
      case 'speed':
        return <Zap className={`w-6 h-6 ${color}`} />;
      case 'excellence':
        return <Award className={`w-6 h-6 ${color}`} />;
      case 'target':
        return <Target className={`w-6 h-6 ${color}`} />;
      default:
        return <Award className={`w-6 h-6 ${color}`} />;
    }
  };

  return (
    <motion.div
      // Framer Motion properties for animation
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition duration-300 cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        {/* Badge Icon */}
        <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
          {getIcon(iconType)}
        </div>

        {/* Badge Content */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Badge;

