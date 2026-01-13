import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import {
  getAllClasses,
  getClassById,
} from "../../api/classApi";
import {
  getAllStudents,
} from "../../api/studentApi";
import {
  Users,
  Loader as LoaderIcon,
  Layers,
} from "lucide-react";
import { toast } from "react-hot-toast";

/*
|--------------------------------------------------------------------------
| Batch Page
|--------------------------------------------------------------------------
| Purpose:
| - View all batches (classes)
| - View students inside a batch
| - ERP-style batch overview
|--------------------------------------------------------------------------
*/

const Batch = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentLoading, setStudentLoading] = useState(false);

  /* ---------------- FETCH CLASSES ---------------- */
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await getAllClasses();
      setClasses(data || []);
    } catch (err) {
      toast.error("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH STUDENTS IN CLASS ---------------- */
  const fetchStudents = async (classId) => {
    setStudentLoading(true);
    try {
      const data = await getAllStudents({ classId });
      setStudents(data || []);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setStudentLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSelectClass = async (cls) => {
    setSelectedClass(cls);
    fetchStudents(cls._id);
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Batches
            </h1>
            <p className="text-gray-500 text-sm">
              Manage classes and view batch-wise students
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ---------------- CLASS LIST ---------------- */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Class Batches
              </h2>

              {loading ? (
                <div className="flex justify-center py-10">
                  <LoaderIcon className="animate-spin w-6 h-6" />
                </div>
              ) : classes.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No batches available
                </p>
              ) : (
                <ul className="space-y-2">
                  {classes.map((cls) => (
                    <li
                      key={cls._id}
                      onClick={() => handleSelectClass(cls)}
                      className={`p-3 rounded-lg cursor-pointer transition ${
                        selectedClass?._id === cls._id
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <p className="font-medium">
                        {cls.name}
                      </p>
                      <p className="text-xs opacity-80">
                        {cls.academicYear}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* ---------------- STUDENT LIST ---------------- */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                {selectedClass
                  ? `Students in ${selectedClass.name}`
                  : "Select a Batch"}
              </h2>

              {!selectedClass ? (
                <p className="text-gray-500 text-sm">
                  Select a batch to view students
                </p>
              ) : studentLoading ? (
                <div className="flex justify-center py-10">
                  <LoaderIcon className="animate-spin w-6 h-6" />
                </div>
              ) : students.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No students found in this batch
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="p-3 text-left">
                          Student ID
                        </th>
                        <th className="p-3 text-left">
                          Name
                        </th>
                        <th className="p-3 text-left">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr
                          key={s._id}
                          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <td className="p-3">
                            {s.studentId}
                          </td>
                          <td className="p-3 font-medium">
                            {s.name}
                          </td>
                          <td className="p-3">
                            {s.email}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Batch;
