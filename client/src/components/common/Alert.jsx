import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const Alert = ({
    type = 'info',
    title,
    message,
    onClose,
    autoClose = false,
    duration = 5000
}) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle,
            className: 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-200',
            iconColor: 'text-green-500',
        },
        error: {
            icon: AlertCircle,
            className: 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-200',
            iconColor: 'text-red-500',
        },
        warning: {
            icon: AlertCircle,
            className: 'bg-amber-50 border-amber-500 text-amber-800 dark:bg-amber-900/20 dark:border-amber-500 dark:text-amber-200',
            iconColor: 'text-amber-500',
        },
        info: {
            icon: Info,
            className: 'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-200',
            iconColor: 'text-blue-500',
        },
    };

    const { icon: Icon, className, iconColor } = config[type];

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) onClose();
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`relative p-4 rounded-xl border-l-4 ${className} mb-4`}
                >
                    <div className="flex items-start gap-3">
                        <Icon className={iconColor} size={24} />

                        <div className="flex-1">
                            {title && (
                                <h4 className="font-semibold mb-1">{title}</h4>
                            )}
                            {message && (
                                <p className="text-sm">{message}</p>
                            )}
                        </div>

                        {onClose && (
                            <button
                                onClick={handleClose}
                                className="hover:opacity-70 transition-opacity"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Alert;
