// client/src/pages/StudentProfile.jsx
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaAward, FaChartLine, FaBullseye, FaSave, FaEdit } from "react-icons/fa";
import axios from "../api/api";
import { toast } from "react-hot-toast";
import Badge from "../components/Badge";
import ChartCard from "../components/ChartCard";
import { AuthContext } from "../context/AuthContext";

/**
 * StudentProfile page
 * - Fetches real student profile data from backend
 * - Allows teachers/admin to edit student profile
 * - Sends modifier info (name, id, role) to backend for audit
 * - Shows lastModified info (who and when)
 *
 * Backend expectations (examples):
 * GET  /students/:id/profile      -> returns student object
 * PUT  /students/:id/profile      -> accepts { ...fields, modifiedBy: { id, name, role } } and returns updated student
 *
 * student object shape (example):
 * {
 *   _id: "...",
 *   name: "Alex Johnson",
 *   studentId: "S-2024-001",
 *   class: "10 - Section A",
 *   department: "Science",
 *   avgGrade: "A- (91%)",
 *   rank: 5,
 *   totalBadges: 7,
 *   weakestSubject: "History",
 *   badges: [{ title, description, iconType, color }],
 *   gradeHistory: [85,88,92,90,95],
 *   attendanceRate: 98,
 *   lastModified: { by: { id, name, role }, at: "2025-10-01T12:34:56.789Z", note: "Updated attendance" }
 * }
 */

const StudentProfile = ({ studentIdProp }) => {
  const { user } = useContext(AuthContext); // { id, name, role }
  // The page may be used by student (view their own profile) or admin/teacher (view any student's profile)
  // If a prop studentIdProp is provided (e.g. admin/teacher clicking a student), use it; otherwise use current user id
  const [studentId] = useState(studentIdProp || user?.id);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    department: "",
    class: "",
    year: "",
    rollNumber: "",
    weakestSubject: "",
  });
  const [saving, setSaving] = useState(false);

  // Permission: only "teacher" or "admin" can edit other students
  const canEdit = user && (user.role === "teacher" || user.role === "admin");

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/students/${studentId}/profile`);
        const data = res.data;
        setStudent(data);
        // populate form with editable fields
        setForm({
          name: data.name || "",
          department: data.department || "",
          class: data.class || "",
          year: data.year || "",
          rollNumber: data.rollNumber || "",
          weakestSubject: data.weakestSubject || "",
        });
      } catch (err) {
        console.error("Failed to fetch student profile:", err);
        toast.error("Failed to load student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [studentId]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = async (note = "") => {
    // Only allow save if user canEdit
    if (!canEdit) {
      toast.error("You do not have permission to edit this profile.");
      return;
    }

    // Basic validation
    if (!form.name || !form.rollNumber) {
      toast.error("Name and Roll Number are required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        modifiedBy: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
        note,
      };

      const res = await axios.put(`/students/${studentId}/profile`, payload);
      setStudent(res.data);
      setEditing(false);
      toast.success("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error(err?.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!student) {
    return <div className="p-6 text-center text-gray-600">Student profile not found.</div>;
  }

  // Format last modified display
  const formatModified = (lastModified) => {
    if (!lastModified) return "No recent changes";
    const date = lastModified.at ? new Date(lastModified.at) : null;
    const when = date ? date.toLocaleString() : "Unknown time";
    const by = lastModified.by ? `${lastModified.by.name} (${lastModified.by.role})` : "Unknown";
    const note = lastModified.note ? ` — ${lastModified.note}` : "";
    return `${by} • ${when}${note}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="container space-y-8"
    >
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
          <FaUserCircle className="w-10 h-10 text-indigo-600 dark:text-indigo-300" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {student.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            Class: {student.class} • ID: {student.studentId}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Last modified: {formatModified(student.lastModified)}
          </p>
        </div>

        {/* Edit controls: only show if user can edit */}
        <div className="flex items-center gap-2">
          {canEdit && (
            <>
              <button
                onClick={() => setEditing((s) => !s)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <FaEdit /> {editing ? "Cancel" : "Edit"}
              </button>
              {editing && (
                <button
                  onClick={() => handleSave("Updated by teacher/admin")}
                  disabled={saving}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    saving ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  <FaSave /> {saving ? "Saving..." : "Save"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <FaChartLine className="w-7 h-7 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Avg. Grade</p>
          <p className="text-2xl font-bold">{student.avgGrade ?? "N/A"}</p>
        </div>

        <div className="card text-center">
          <FaAward className="w-7 h-7 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Class Rank</p>
          <p className="text-2xl font-bold">#{student.rank ?? "—"}</p>
        </div>

        <div className="card text-center">
          <FaAward className="w-7 h-7 text-indigo-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Badges</p>
          <p className="text-2xl font-bold">{student.totalBadges ?? 0}</p>
        </div>

        <div className="card text-center">
          <FaBullseye className="w-7 h-7 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Focus Area</p>
          <p className="text-xl font-semibold text-red-600">{student.weakestSubject ?? "—"}</p>
        </div>
      </section>

      {/* Editable profile fields / display */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-3">Profile Info</h3>

          {/* If editing enabled show form fields, otherwise display */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              {editing ? (
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              ) : (
                <p className="text-gray-800">{student.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Department</label>
              {editing ? (
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              ) : (
                <p className="text-gray-800">{student.department || "—"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Class / Section</label>
              {editing ? (
                <input
                  name="class"
                  value={form.class}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              ) : (
                <p className="text-gray-800">{student.class}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Year</label>
              {editing ? (
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              ) : (
                <p className="text-gray-800">{student.year || "—"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Roll Number</label>
              {editing ? (
                <input
                  name="rollNumber"
                  value={form.rollNumber}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              ) : (
                <p className="text-gray-800">{student.rollNumber || "—"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Weakest Subject</label>
              {editing ? (
                <input
                  name="weakestSubject"
                  value={form.weakestSubject}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              ) : (
                <p className="text-gray-800">{student.weakestSubject || "—"}</p>
              )}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Badges</h3>
            <p className="text-sm text-gray-500">Earned: {student.totalBadges ?? 0}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.isArray(student.badges) && student.badges.length > 0 ? (
              student.badges.map((b, i) => (
                <Badge
                  key={i}
                  title={b.title}
                  description={b.description}
                  iconType={b.iconType}
                  color={b.color}
                />
              ))
            ) : (
              <p className="text-gray-500">No badges yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Grade History">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-2">Recent scores</p>
            <div className="text-gray-800">{student.gradeHistory?.join(", ") ?? "—"}</div>
          </div>
        </ChartCard>

        <ChartCard title="Attendance">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 mb-2">Attendance Rate</p>
            <div className="text-3xl font-bold text-green-600">{student.attendanceRate ?? "—"}%</div>
          </div>
        </ChartCard>
      </section>
    </motion.div>
  );
};

export default StudentProfile;
