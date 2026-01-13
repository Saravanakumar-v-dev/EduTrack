import { motion } from 'framer-motion';
import { Users, TrendingUp, BookOpen, Search, Filter } from 'lucide-react';
import { useState } from 'react';

const StudentList = ({ students = [], onSelectStudent }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('all'); // all, atRisk, excellent

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterBy === 'atRisk') return matchesSearch && student.average < 60;
        if (filterBy === 'excellent') return matchesSearch && student.average >= 85;
        return matchesSearch;
    });

    const getPerformanceColor = (average) => {
        if (average >= 85) return 'text-green-600 bg-green-50 border-green-200';
        if (average >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (average >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <Users className="text-indigo-600 dark:text-indigo-400" size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Management</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{filteredStudents.length} students</p>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilterBy('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterBy === 'all'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterBy('excellent')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterBy === 'excellent'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        Excellent
                    </button>
                    <button
                        onClick={() => setFilterBy('atRisk')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterBy === 'atRisk'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                    >
                        At Risk
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            {/* Student List */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredStudents.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">No students found</p>
                    </div>
                ) : (
                    filteredStudents.map((student, index) => (
                        <motion.div
                            key={student.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02, x: 4 }}
                            onClick={() => onSelectStudent && onSelectStudent(student)}
                            className="flex items-center justify-between p-4 border-2 border-gray-100 dark:border-gray-700 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {student.name.charAt(0)}
                                </div>

                                {/* Student Info */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                        {student.name}
                                    </h4>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                                        <span>{student.id}</span>
                                        <span>•</span>
                                        <span>{student.class}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Badge */}
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{student.average}%</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Average</div>
                                </div>

                                <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getPerformanceColor(student.average)}`}>
                                    {student.average >= 85 ? 'A' :
                                        student.average >= 70 ? 'B' :
                                            student.average >= 60 ? 'C' : 'F'}
                                </div>

                                {student.trend && (
                                    <div className={`flex items-center gap-1 ${student.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        <TrendingUp
                                            size={16}
                                            style={{ transform: student.trend < 0 ? 'rotate(180deg)' : 'none' }}
                                        />
                                        <span className="text-sm font-medium">{Math.abs(student.trend)}%</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default StudentList;
