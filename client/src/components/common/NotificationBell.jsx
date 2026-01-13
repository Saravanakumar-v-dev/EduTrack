import { motion } from 'framer-motion';
import { Bell, Check } from 'lucide-react';
import { useState } from 'react';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'New Grade Posted',
            message: 'Your Mathematics Unit Test 3 grade has been posted',
            time: '5 minutes ago',
            read: false,
            type: 'grade',
        },
        {
            id: 2,
            title: 'Assignment Due',
            message: 'Physics Lab Report is due tomorrow',
            time: '2 hours ago',
            read: false,
            type: 'assignment',
        },
        {
            id: 3,
            title: 'Attendance Alert',
            message: 'You were marked absent for Chemistry class',
            time: '1 day ago',
            read: true,
            type: 'attendance',
        },
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <Bell size={24} className="text-gray-600" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-10"
                    />

                    {/* Notification Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-20"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <p>No notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notifications.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-indigo-50/50' : ''
                                                }`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.read ? 'bg-indigo-600' : 'bg-gray-300'
                                                        }`}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="font-semibold text-gray-900 text-sm">
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.read && (
                                                            <span className="flex-shrink-0">
                                                                <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                            <button className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2">
                                View All Notifications
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
};

export default NotificationBell;
