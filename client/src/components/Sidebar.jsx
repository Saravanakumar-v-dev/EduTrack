import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, BarChart3, BookOpen, FileText, LogOut, Settings } from 'lucide-react';

/**
 * Sidebar Navigation Component for EduTrack.
 * Displays navigation links filtered based on the authenticated user's role.
 *
 * @param {string} role - The current user's role ('admin', 'teacher', or 'student').
 * @param {function} logout - Function to handle user sign-out.
 */
const Sidebar = ({ role, logout }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    // Define navigation items with required roles
    const navItems = [
        // Home/Dashboard is the default entry point for teachers/admins
        { name: 'Dashboard', path: '/', icon: Home, roles: ['admin', 'teacher'] },
        // Student's main view is their profile
        { name: 'My Profile', path: '/profile', icon: BookOpen, roles: ['student'] }, 
        
        { name: 'Analytics', path: '/analytics', icon: BarChart3, roles: ['admin', 'teacher'] },
        { name: 'Reports', path: '/reports', icon: FileText, roles: ['admin', 'teacher'] },
        // Admin Panel for data management (upload, user management)
        { name: 'Admin Panel', path: '/admin', icon: Users, roles: ['admin'] },
        // Optional: Settings/Account page for all users
        { name: 'Settings', path: '/settings', icon: Settings, roles: ['admin', 'teacher', 'student'] }, 
    ];

    // Filter items based on the user's role
    const filteredItems = navItems.filter(item => item.roles.includes(role));

    return (
        <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
            className="w-64 flex flex-col bg-white dark:bg-gray-800 shadow-2xl min-h-screen p-4 sticky top-0 z-20"
        >
            {/* Logo/Title */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-10 border-b pb-4 border-gray-100 dark:border-gray-700"
            >
                Edu<span className="text-gray-800 dark:text-white">Track</span>
            </motion.div>

            {/* Navigation Links */}
            <nav className="flex-grow space-y-2">
                {filteredItems.map((item) => {
                    // Determine if the link is active
                    const isActive = currentPath === item.path || (item.path === '/' && currentPath === '/dashboard');
                    
                    return (
                        <motion.div 
                            key={item.name}
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link
                                to={item.path}
                                className={`
                                    flex items-center p-3 rounded-xl transition-all duration-200 font-medium
                                    ${isActive 
                                        ? 'bg-indigo-600 text-white shadow-md' 
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600'
                                    }
                                `}
                            >
                                <item.icon className="w-5 h-5 mr-4" />
                                <span>{item.name}</span>
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* User Info and Logout */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="text-center mb-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Role: <span className="capitalize font-bold text-indigo-600 dark:text-indigo-400">{role}</span>
                    </span>
                </div>
                <motion.button
                    onClick={logout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center w-full p-3 rounded-xl text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200 font-medium"
                >
                    <LogOut className="w-5 h-5 mr-4" />
                    <span>Sign Out</span>
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Sidebar;