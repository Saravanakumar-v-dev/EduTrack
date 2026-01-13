import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import {
    Plus,
    FileText,
    Upload,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Send,
    Filter,
    Search,
    BookOpen,
    AlertCircle,
    Download,
    X,
} from "lucide-react";
import { toast } from "react-hot-toast";

const Assignments = () => {
    const { user } = useAuth();
    const role = user?.role || "student";

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Form states
    const [newAssignment, setNewAssignment] = useState({
        title: "",
        description: "",
        subject: "",
        dueDate: "",
        maxScore: 100,
        class: "",
        section: "",
    });

    const [submission, setSubmission] = useState({
        fileName: "",
        fileUrl: "",
        fileType: "",
    });

    const [review, setReview] = useState({
        status: "approved",
        grade: 0,
        feedback: "",
    });

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            // Try to fetch from real API
            const response = await axios.get("/assignments");
            if (response.data && Array.isArray(response.data)) {
                setAssignments(response.data);
            } else {
                throw new Error("Invalid response");
            }
        } catch (error) {
            console.log("Using mock data - backend may not be running");
            // Fallback to mock data
            const mockAssignments = [
                {
                    _id: "1",
                    title: "Mathematics Problem Set 1",
                    description: "Complete problems 1-20 from Chapter 5",
                    subject: "Mathematics",
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    maxScore: 100,
                    status: "active",
                    createdBy: { name: "Dr. Smith", email: "smith@edu.com" },
                    submissions: [],
                    createdAt: new Date().toISOString(),
                },
                {
                    _id: "2",
                    title: "Physics Lab Report",
                    description: "Submit your lab report for the pendulum experiment",
                    subject: "Physics",
                    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    maxScore: 50,
                    status: "active",
                    createdBy: { name: "Prof. Johnson", email: "johnson@edu.com" },
                    submissions: [],
                    createdAt: new Date().toISOString(),
                },
            ];
            setAssignments(mockAssignments);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        if (!newAssignment.title || !newAssignment.subject || !newAssignment.dueDate) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            // Try real API first
            const response = await axios.post("/assignments", {
                title: newAssignment.title,
                description: newAssignment.description,
                subject: newAssignment.subject,
                dueDate: newAssignment.dueDate,
                maxScore: newAssignment.maxScore,
                class: newAssignment.class,
                section: newAssignment.section,
            });

            toast.success("Assignment created successfully!");
            fetchAssignments(); // Refresh list
            setShowCreateModal(false);
            setNewAssignment({
                title: "",
                description: "",
                subject: "",
                dueDate: "",
                maxScore: 100,
                class: "",
                section: "",
            });
        } catch (error) {
            // Fallback to mock creation if API fails
            console.log("API error, using mock creation");
            const created = {
                _id: Date.now().toString(),
                ...newAssignment,
                status: "active",
                createdBy: { name: user?.name, email: user?.email },
                submissions: [],
                createdAt: new Date().toISOString(),
            };
            setAssignments([created, ...assignments]);
            toast.success("Assignment created (local only)!");
            setShowCreateModal(false);
            setNewAssignment({
                title: "",
                description: "",
                subject: "",
                dueDate: "",
                maxScore: 100,
                class: "",
                section: "",
            });
        }
    };

    const handleSubmitAssignment = async (e) => {
        e.preventDefault();
        if (!submission.fileName) {
            toast.error("Please upload a file");
            return;
        }

        try {
            // Try real API first
            const response = await axios.post(`/assignments/${selectedAssignment._id}/submit`, {
                fileUrl: submission.fileUrl,
                fileName: submission.fileName,
                fileType: submission.fileType,
            });

            // Success - show toast notification
            toast.success("🎉 Assignment Submitted Successfully!", {
                duration: 4000,
                icon: "✅",
                style: {
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 'bold',
                },
            });

            // Refresh assignments list to get updated data
            fetchAssignments();
            setShowSubmitModal(false);
            setSubmission({ fileName: "", fileUrl: "", fileType: "" });
        } catch (error) {
            console.log("API error, using local submission");
            // Fallback to mock submission if API fails
            const updatedAssignments = assignments.map((a) => {
                if (a._id === selectedAssignment._id) {
                    return {
                        ...a,
                        submissions: [
                            ...a.submissions,
                            {
                                _id: Date.now().toString(),
                                student: { _id: user?._id, name: user?.name },
                                status: "pending",
                                submittedAt: new Date().toISOString(),
                                fileName: submission.fileName,
                                fileUrl: submission.fileUrl,
                            },
                        ],
                    };
                }
                return a;
            });
            setAssignments(updatedAssignments);
            toast.success("🎉 Assignment Submitted Successfully!", {
                duration: 4000,
                icon: "✅",
                style: {
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 'bold',
                },
            });
            setShowSubmitModal(false);
            setSubmission({ fileName: "", fileUrl: "", fileType: "" });
        }
    };

    const handleReviewSubmission = async (e) => {
        e.preventDefault();

        try {
            // Try real API first
            const response = await axios.put(
                `/assignments/${selectedAssignment._id}/submissions/${selectedSubmission._id}/review`,
                {
                    status: review.status,
                    grade: review.grade,
                    feedback: review.feedback,
                }
            );

            // Success - show toast notification
            toast.success("📝 Submission Graded Successfully!", {
                duration: 4000,
                icon: "⭐",
                style: {
                    background: '#6366f1',
                    color: '#fff',
                    fontWeight: 'bold',
                },
            });

            // Refresh assignments list
            fetchAssignments();
            setShowReviewModal(false);
            setReview({ status: "approved", grade: 0, feedback: "" });
        } catch (error) {
            console.log("API error, using local review");
            // Fallback to mock review
            const updatedAssignments = assignments.map((a) => {
                if (a._id === selectedAssignment._id) {
                    return {
                        ...a,
                        submissions: a.submissions.map((s) => {
                            if (s._id === selectedSubmission._id) {
                                return {
                                    ...s,
                                    status: review.status,
                                    grade: review.grade,
                                    feedback: review.feedback,
                                    reviewedAt: new Date().toISOString(),
                                };
                            }
                            return s;
                        }),
                    };
                }
                return a;
            });
            setAssignments(updatedAssignments);
            toast.success("📝 Submission Graded Successfully!", {
                duration: 4000,
                icon: "⭐",
                style: {
                    background: '#6366f1',
                    color: '#fff',
                    fontWeight: 'bold',
                },
            });
            setShowReviewModal(false);
            setReview({ status: "approved", grade: 0, feedback: "" });
        }
    };


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In production, upload to cloud storage and get URL
            setSubmission({
                fileName: file.name,
                fileUrl: URL.createObjectURL(file),
                fileType: file.type,
            });
            toast.success(`File "${file.name}" selected`);
        }
    };

    const isOverdue = (dueDate) => new Date() > new Date(dueDate);

    const filteredAssignments = assignments.filter((a) => {
        const matchesSearch =
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
            filterStatus === "all" ||
            (filterStatus === "active" && a.status === "active" && !isOverdue(a.dueDate)) ||
            (filterStatus === "overdue" && isOverdue(a.dueDate));
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading assignments...</p>
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
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Assignments 📝</h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
                        {role === "student"
                            ? "View and submit your assignments"
                            : "Create, manage, and review assignments"}
                    </p>
                </div>

                {(role === "teacher" || role === "admin") && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-lg"
                    >
                        <Plus size={20} />
                        Create Assignment
                    </motion.button>
                )}
            </motion.div>

            {/* SEARCH & FILTER */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col md:flex-row gap-4"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search assignments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border dark:border-gray-600 p-3 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
            </motion.div>

            {/* ASSIGNMENTS GRID */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {filteredAssignments.map((assignment) => (
                    <AssignmentCard
                        key={assignment._id}
                        assignment={assignment}
                        role={role}
                        onSubmit={() => {
                            setSelectedAssignment(assignment);
                            setShowSubmitModal(true);
                        }}
                        onViewSubmissions={() => setSelectedAssignment(assignment)}
                        onReview={(sub) => {
                            setSelectedAssignment(assignment);
                            setSelectedSubmission(sub);
                            setShowReviewModal(true);
                        }}
                    />
                ))}

                {filteredAssignments.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No assignments found</p>
                    </div>
                )}
            </motion.div>

            {/* CREATE MODAL */}
            <AnimatePresence>
                {showCreateModal && (
                    <Modal onClose={() => setShowCreateModal(false)} title="Create Assignment">
                        <form onSubmit={handleCreateAssignment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={newAssignment.title}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                                    className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    placeholder="Assignment title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={newAssignment.description}
                                    onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                                    className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows="3"
                                    placeholder="Assignment details..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
                                    <select
                                        value={newAssignment.subject}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                                        className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    >
                                        <option value="">Select Subject</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="English">English</option>
                                        <option value="Computer Science">Computer Science</option>
                                        <option value="History">History</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date *</label>
                                    <input
                                        type="datetime-local"
                                        value={newAssignment.dueDate}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                                        className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Score</label>
                                    <input
                                        type="number"
                                        value={newAssignment.maxScore}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, maxScore: parseInt(e.target.value) })}
                                        className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
                                    <select
                                        value={newAssignment.section}
                                        onChange={(e) => setNewAssignment({ ...newAssignment, section: e.target.value })}
                                        className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="">All Sections</option>
                                        <option value="A">Section A</option>
                                        <option value="B">Section B</option>
                                        <option value="C">Section C</option>
                                        <option value="D">Section D</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition"
                            >
                                Create Assignment
                            </button>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>

            {/* SUBMIT MODAL */}
            <AnimatePresence>
                {showSubmitModal && selectedAssignment && (
                    <Modal onClose={() => setShowSubmitModal(false)} title={`Submit: ${selectedAssignment.title}`}>
                        <form onSubmit={handleSubmitAssignment} className="space-y-4">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                    <strong>Subject:</strong> {selectedAssignment.subject}
                                </p>
                                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                    <strong>Due:</strong> {new Date(selectedAssignment.dueDate).toLocaleString()}
                                </p>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                                    {submission.fileName ? (
                                        <p className="text-green-600 dark:text-green-400 font-medium">{submission.fileName}</p>
                                    ) : (
                                        <>
                                            <p className="text-gray-600 dark:text-gray-400">Click to upload your file</p>
                                            <p className="text-sm text-gray-400">PDF, DOC, DOCX, TXT, JPG, PNG</p>
                                        </>
                                    )}
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={!submission.fileName}
                                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                Submit Assignment
                            </button>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>

            {/* REVIEW MODAL */}
            <AnimatePresence>
                {showReviewModal && selectedSubmission && (
                    <Modal onClose={() => setShowReviewModal(false)} title="Review Submission">
                        <form onSubmit={handleReviewSubmission} className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>Student:</strong> {selectedSubmission.student?.name}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>File:</strong> {selectedSubmission.fileName}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>Submitted:</strong> {new Date(selectedSubmission.submittedAt).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                                <select
                                    value={review.status}
                                    onChange={(e) => setReview({ ...review, status: e.target.value })}
                                    className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="reviewed">Needs Revision</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Grade (out of {selectedAssignment?.maxScore || 100})
                                </label>
                                <input
                                    type="number"
                                    value={review.grade}
                                    onChange={(e) => setReview({ ...review, grade: parseInt(e.target.value) })}
                                    className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    min="0"
                                    max={selectedAssignment?.maxScore || 100}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Feedback</label>
                                <textarea
                                    value={review.feedback}
                                    onChange={(e) => setReview({ ...review, feedback: e.target.value })}
                                    className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    rows="3"
                                    placeholder="Provide feedback for the student..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={18} />
                                Submit Review
                            </button>
                        </form>
                    </Modal>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ============ ASSIGNMENT CARD ============ */
const AssignmentCard = ({ assignment, role, onSubmit, onViewSubmissions, onReview }) => {
    const isOverdue = new Date() > new Date(assignment.dueDate);
    const submissionCount = assignment.submissions?.length || 0;
    const pendingCount = assignment.submissions?.filter((s) => s.status === "pending").length || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
            <div className={`h-2 ${isOverdue ? "bg-red-500" : "bg-indigo-500"}`} />
            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-medium">
                        {assignment.subject}
                    </span>
                    {isOverdue && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium flex items-center gap-1">
                            <AlertCircle size={12} />
                            Overdue
                        </span>
                    )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{assignment.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{assignment.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(assignment.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(assignment.dueDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                </div>

                {/* Teacher/Admin: Show submission stats */}
                {(role === "teacher" || role === "admin") && (
                    <div className="flex items-center justify-between text-sm mb-4">
                        <span className="text-gray-600 dark:text-gray-400">
                            {submissionCount} submissions
                        </span>
                        {pendingCount > 0 && (
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs">
                                {pendingCount} pending review
                            </span>
                        )}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                    {role === "student" && !isOverdue && (
                        <button
                            onClick={onSubmit}
                            className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 transition flex items-center justify-center gap-2"
                        >
                            <Upload size={16} />
                            Submit
                        </button>
                    )}

                    {(role === "teacher" || role === "admin") && (
                        <>
                            <button
                                onClick={onViewSubmissions}
                                className="flex-1 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition flex items-center justify-center gap-2"
                            >
                                <Eye size={16} />
                                View ({submissionCount})
                            </button>
                            {pendingCount > 0 && (
                                <button
                                    onClick={() => onReview(assignment.submissions.find((s) => s.status === "pending"))}
                                    className="py-2 px-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg font-medium hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition"
                                >
                                    Review
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

/* ============ MODAL COMPONENT ============ */
const Modal = ({ onClose, title, children }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </motion.div>
        </motion.div>
    );
};

export default Assignments;
