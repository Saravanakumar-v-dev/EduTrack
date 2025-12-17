// client/src/components/StudentTable.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function StudentTable({ students = [] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    if (!query) return students;
    const q = query.toLowerCase();
    return students.filter(
      (s) => s.rollNumber?.toLowerCase().includes(q) || s.user?.name?.toLowerCase().includes(q) || s.user?.email?.toLowerCase().includes(q)
    );
  }, [students, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Students</h3>
        <div className="flex items-center gap-2">
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search name / roll / email" className="px-3 py-2 border rounded-lg text-sm" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b">
              <th className="py-2">#</th>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Roll</th>
              <th className="py-2">Class</th>
              <th className="py-2">Avg</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s, idx) => (
              <motion.tr key={s._id || idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="border-b hover:bg-slate-50">
                <td className="py-2">{(page - 1) * pageSize + idx + 1}</td>
                <td className="py-2">{s.user?.name || "—"}</td>
                <td className="py-2">{s.user?.email || "—"}</td>
                <td className="py-2">{s.rollNumber || "—"}</td>
                <td className="py-2">{s.classId?.name || "—"}</td>
                <td className="py-2">{s.averageScore ? `${s.averageScore}%` : "—"}</td>
              </motion.tr>
            ))}

            {visible.length === 0 && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-400">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
          <div className="px-3 py-1 text-sm">{page} / {totalPages}</div>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
