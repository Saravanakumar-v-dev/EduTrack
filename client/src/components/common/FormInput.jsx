import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, X } from 'lucide-react';

const FormInput = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    required = false,
    placeholder,
    icon: Icon,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const handleChange = (e) => {
        onChange(e);
        // Simple validation
        if (required) {
            setIsValid(e.target.value.trim().length > 0);
        }
    };

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon size={20} />
                    </div>
                )}

                <input
                    type={type}
                    value={value}
                    onChange={handleChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-10 py-3 border-2 rounded-xl transition-all duration-200 dark:bg-gray-800 dark:text-white ${error
                            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                            : isFocused
                                ? 'border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                        } focus:outline-none`}
                    {...props}
                />

                {/* Validation Icon */}
                {required && value && !error && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {isValid ? (
                            <Check size={20} className="text-green-500" />
                        ) : (
                            <X size={20} className="text-red-500" />
                        )}
                    </motion.div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default FormInput;
