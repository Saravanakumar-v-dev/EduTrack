import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const showSuccess = (message, duration) => addToast(message, 'success', duration);
    const showError = (message, duration) => addToast(message, 'error', duration);
    const showWarning = (message, duration) => addToast(message, 'warning', duration);
    const showInfo = (message, duration) => addToast(message, 'info', duration);

    return (
        <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        toast={toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

const Toast = ({ toast, onClose }) => {
    const { type, message } = toast;

    const config = {
        success: {
            icon: CheckCircle,
            className: 'bg-green-50 text-green-800 border-green-200',
            iconColor: 'text-green-500',
        },
        error: {
            icon: AlertCircle,
            className: 'bg-red-50 text-red-800 border-red-200',
            iconColor: 'text-red-500',
        },
        warning: {
            icon: AlertTriangle,
            className: 'bg-amber-50 text-amber-800 border-amber-200',
            iconColor: 'text-amber-500',
        },
        info: {
            icon: Info,
            className: 'bg-blue-50 text-blue-800 border-blue-200',
            iconColor: 'text-blue-500',
        },
    };

    const { icon: Icon, className, iconColor } = config[type] || config.info;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 shadow-lg min-w-[300px] max-w-md ${className}`}
        >
            <Icon className={iconColor} size={20} />
            <p className="flex-1 font-medium text-sm">{message}</p>
            <button
                onClick={onClose}
                className="hover:opacity-70 transition-opacity"
            >
                <X size={18} />
            </button>
        </motion.div>
    );
};

export default ToastProvider;
