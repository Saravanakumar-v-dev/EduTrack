import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import adminApi from "../../api/adminApi";
import {
    Users,
    GraduationCap,
    UserPlus,
    Edit,
    Trash2,
    Search,
    Filter,
    Download,
    RefreshCw,
    ChevronDown,
    Mail,
    Phone,
    BookOpen,
    Shield,
    Eye,
    Save,
    X,
} from "lucide-react";
import { toast } from "react-hot-toast";

const AdminProfile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("students");
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Real Data from MongoDB
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);

    // Fetch users from MongoDB
    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Fetch students
            const studentRes = await adminApi.getUsersByRole("student", "", 1, 100);
            if (studentRes.success) {
                setStudents(studentRes.data.map(u => ({
                    id: u._id,
                    name: u.name,
                    email: u.email,
                    phone: u.phone || "N/A",
                    class: u.class || "N/A",
                    rollNo: u.rollNo || `ST${String(studentRes.data.indexOf(u) + 1).padStart(3, '0')}`,
                    assignedTeacher: u.assignedTeacher || null,
                    status: u.isVerified ? "active" : "inactive",
                    avgScore: u.avgScore || 0
                })));
            }

            // Fetch teachers
            const teacherRes = await adminApi.getUsersByRole("teacher", "", 1, 100);
            if (teacherRes.success) {
                setTeachers(teacherRes.data.map(t => ({
                    id: t._id,
                    name: t.name,
                    email: t.email,
                    phone: t.phone || "N/A",
                    department: t.department || "General",
                    subject: t.subject || "N/A",
                    studentsCount: t.studentsCount || 0,
                    status: t.isVerified ? "active" : "inactive"
                })));
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
            toast.error("Failed to load users from database");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter data based on search
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.class.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Add new user
    const [newUser, setNewUser] = useState({
        name: "", email: "", phone: "", class: "", department: "", subject: "", role: "student"
    });

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email) {
            toast.error("Name and Email are required!");
            return;
        }

        try {
            const userData = {
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
            };

            const response = await adminApi.createUser(userData);

            if (response.success) {
                toast.success(`${newUser.role === "student" ? "Student" : "Teacher"} added to database!`);
                setNewUser({ name: "", email: "", phone: "", class: "", department: "", subject: "", role: "student" });
                setShowAddModal(false);
                fetchUsers(); // Refresh the list from database
            }
        } catch (error) {
            console.error("Failed to create user:", error);
            toast.error(error.response?.data?.message || "Failed to create user");
        }
    };

    // Edit user
    const handleEditUser = async () => {
        try {
            const userData = {
                name: selectedUser.name,
                email: selectedUser.email,
                phone: selectedUser.phone,
            };

            const response = await adminApi.updateUser(selectedUser.id, userData);

            if (response.success) {
                toast.success("Record updated in database!");
                setShowEditModal(false);
                setSelectedUser(null);
                fetchUsers(); // Refresh the list from database
            }
        } catch (error) {
            console.error("Failed to update user:", error);
            toast.error(error.response?.data?.message || "Failed to update user");
        }
    };

    // Delete user
    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await adminApi.deleteUser(id);

            if (response.success) {
                toast.success("User deleted from database!");
                fetchUsers(); // Refresh the list from database
            }
        } catch (error) {
            console.error("Failed to delete user:", error);
            toast.error(error.response?.data?.message || "Failed to delete user");
        }
    };

    // Assign teacher to student (local state + could be API call)
    const handleAssignTeacher = async (studentId, teacherName) => {
        try {
            await adminApi.updateUser(studentId, { assignedTeacher: teacherName });
            setStudents(students.map(s =>
                s.id === studentId ? { ...s, assignedTeacher: teacherName } : s
            ));
            toast.success(`Teacher assigned successfully!`);
        } catch (error) {
            toast.error("Failed to assign teacher");
        }
    };

    // Export data
    const exportData = () => {
        const data = activeTab === "students" ? students : teachers;
        const csv = [
            Object.keys(data[0]).join(","),
            ...data.map(row => Object.values(row).join(","))
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${activeTab}_data.csv`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Data exported!");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Admin Panel 🛡️
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                        Manage all users, records, and assignments
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition"
                    >
                        <UserPlus size={20} />
                        Add User
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={exportData}
                        className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
                    >
                        <Download size={20} />
                        Export
                    </motion.button>
                </div>
            </motion.div>

            {/* STATS OVERVIEW */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <StatBox icon={<GraduationCap />} label="Total Students" value={students.length} color="indigo" />
                <StatBox icon={<Users />} label="Total Teachers" value={teachers.length} color="emerald" />
                <StatBox icon={<BookOpen />} label="Active Classes" value="12" color="purple" />
                <StatBox icon={<Shield />} label="Admin Role" value={user?.name || "Admin"} color="amber" isText />
            </motion.div>

            {/* TABS */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                {["students", "teachers"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 font-medium rounded-t-lg transition-all ${activeTab === tab
                            ? "bg-purple-600 text-white"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                    >
                        {tab === "students" ? "👨‍🎓 Students" : "👨‍🏫 Teachers"}
                    </button>
                ))}
            </div>

            {/* SEARCH & FILTER */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                    <Filter size={18} />
                    Filter
                    <ChevronDown size={16} />
                </button>
                <button
                    onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {/* DATA TABLE */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                {activeTab === "students" ? (
                                    <>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Student</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Class</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Contact</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Assigned Teacher</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Avg Score</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Teacher</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Department</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Subject</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Contact</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Students</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {activeTab === "students" ? (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{student.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium text-sm">
                                                {student.class}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{student.phone}</td>
                                        <td className="py-4 px-6">
                                            <select
                                                value={student.assignedTeacher || ""}
                                                onChange={(e) => handleAssignTeacher(student.id, e.target.value)}
                                                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border-0 text-sm cursor-pointer"
                                            >
                                                <option value="">Unassigned</option>
                                                {teachers.map((t) => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`font-bold ${student.avgScore >= 80 ? "text-green-600" : student.avgScore >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                                                {student.avgScore}%
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === "active"
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setSelectedUser(student); setShowEditModal(true); }}
                                                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 transition"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(student.id)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                filteredTeachers.map((teacher) => (
                                    <tr key={teacher.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                                                    {teacher.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{teacher.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{teacher.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-medium text-sm">
                                                {teacher.department}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{teacher.subject}</td>
                                        <td className="py-4 px-6 text-gray-600 dark:text-gray-400">{teacher.phone}</td>
                                        <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{teacher.studentsCount}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${teacher.status === "active"
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                                }`}>
                                                {teacher.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => { setSelectedUser(teacher); setShowEditModal(true); }}
                                                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 transition"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(teacher.id)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600 transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {activeTab === "students" ? filteredStudents.length : filteredTeachers.length} results
                    </p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">Previous</button>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">1</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">Next</button>
                    </div>
                </div>
            </motion.div>

            {/* ADD USER MODAL */}
            <AnimatePresence>
                {showAddModal && (
                    <Modal title="Add New User" onClose={() => setShowAddModal(false)}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-0"
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                            </div>
                            <InputField label="Full Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                            <InputField label="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} type="email" />
                            <InputField label="Phone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
                            {newUser.role === "student" && (
                                <InputField label="Class" value={newUser.class} onChange={(e) => setNewUser({ ...newUser, class: e.target.value })} placeholder="e.g., Class 10-A" />
                            )}
                            {newUser.role === "teacher" && (
                                <>
                                    <InputField label="Department" value={newUser.department} onChange={(e) => setNewUser({ ...newUser, department: e.target.value })} />
                                    <InputField label="Subject" value={newUser.subject} onChange={(e) => setNewUser({ ...newUser, subject: e.target.value })} />
                                </>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddUser}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium"
                            >
                                <Save size={18} className="inline mr-2" />
                                Add {newUser.role === "student" ? "Student" : "Teacher"}
                            </motion.button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>

            {/* EDIT USER MODAL */}
            <AnimatePresence>
                {showEditModal && selectedUser && (
                    <Modal title={`Edit ${activeTab === "students" ? "Student" : "Teacher"}`} onClose={() => { setShowEditModal(false); setSelectedUser(null); }}>
                        <div className="space-y-4">
                            <InputField label="Full Name" value={selectedUser.name} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} />
                            <InputField label="Email" value={selectedUser.email} onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })} type="email" />
                            <InputField label="Phone" value={selectedUser.phone} onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })} />
                            {activeTab === "students" && (
                                <InputField label="Class" value={selectedUser.class} onChange={(e) => setSelectedUser({ ...selectedUser, class: e.target.value })} />
                            )}
                            {activeTab === "teachers" && (
                                <>
                                    <InputField label="Department" value={selectedUser.department} onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })} />
                                    <InputField label="Subject" value={selectedUser.subject} onChange={(e) => setSelectedUser({ ...selectedUser, subject: e.target.value })} />
                                </>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <select
                                    value={selectedUser.status}
                                    onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-0"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleEditUser}
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
                            >
                                <Save size={18} className="inline mr-2" />
                                Save Changes
                            </motion.button>
                        </div>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ---------- STAT BOX ---------- */
const StatBox = ({ icon, label, value, color, isText }) => {
    const colors = {
        indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
        emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
        purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
        amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 flex items-center gap-4"
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className={`font-bold text-gray-900 dark:text-white ${isText ? "text-lg" : "text-2xl"}`}>{value}</p>
            </div>
        </motion.div>
    );
};

/* ---------- MODAL ---------- */
const Modal = ({ title, children, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <X size={20} className="text-gray-500" />
                </button>
            </div>
            {children}
        </motion.div>
    </motion.div>
);

/* ---------- INPUT FIELD ---------- */
const InputField = ({ label, value, onChange, type = "text", placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border-0 focus:ring-2 focus:ring-purple-500 outline-none"
        />
    </div>
);

export default AdminProfile;
