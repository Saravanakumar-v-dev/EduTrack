import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import { toast } from "react-hot-toast";

const MarkAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    axios.get("/api/students").then((res) => {
      setStudents(res.data.students || res.data);
    });
  }, []);

  const toggleAttendance = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const submitHandler = async () => {
    try {
      await axios.post("/api/attendance/mark", {
        records: Object.entries(attendance).map(([id, present]) => ({
          student: id,
          present,
        })),
      });
      toast.success("Attendance saved");
    } catch {
      toast.error("Failed to save attendance");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>

          <div className="bg-white p-6 rounded shadow">
            {students.map((s) => (
              <div
                key={s._id}
                className="flex justify-between py-2 border-b"
              >
                <span>{s.name}</span>
                <input
                  type="checkbox"
                  checked={attendance[s._id] || false}
                  onChange={() => toggleAttendance(s._id)}
                />
              </div>
            ))}

            <button
              onClick={submitHandler}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit Attendance
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default MarkAttendance;
