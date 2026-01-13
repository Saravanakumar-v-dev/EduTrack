import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';

const SearchBar = ({ placeholder = 'Search...', onSearch, className = '' }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSearch}
            className={`relative ${className}`}
        >
            <div
                className={`relative flex items-center transition-all duration-200 ${isFocused ? 'ring-2 ring-indigo-500' : ''
                    }`}
            >
                <Search
                    size={20}
                    className={`absolute left-4 transition-colors ${isFocused ? 'text-indigo-600' : 'text-gray-400'
                        }`}
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
                {query && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        type="submit"
                        className="absolute right-2 px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Search
                    </motion.button>
                )}
            </div>
        </motion.form>
    );
};

export default SearchBar;
