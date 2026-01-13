import { useEffect, useState } from "react";
import axios from "../../api/axios";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import { toast } from "react-hot-toast";

const EnterMarks = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    student: "",
    subject: "",
    score: "",
    examType: "internal",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [s, sub] = await Promise.all([
        axios.get("/api/students"),
        axios.get("/api/subjects"),
      ]);
      setStudents(s.data.students || s.data);
      setSubjects(sub.data);
    };
    fetchData();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/marks", form);
      toast.success("Marks added successfully");
      setForm({ ...form, score: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex bg-gray-100 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2 className="text-xl font-semibold mb-4">Enter Marks</h2>

          <form
            onSubmit={submitHandler}
            className="bg-white p-6 rounded shadow max-w-lg space-y-4"
          >
            <select
              className="w-full p-2 border rounded"
              value={form.student}
              onChange={(e) =>
                setForm({ ...form, student: e.target.value })
              }
              required
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              className="w-full p-2 border rounded"
              value={form.subject}
              onChange={(e) =>
                setForm({ ...form, subject: e.target.value })
              }
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Score"
              className="w-full p-2 border rounded"
              value={form.score}
              onChange={(e) =>
                setForm({ ...form, score: e.target.value })
              }
              required
            />

            <select
              className="w-full p-2 border rounded"
              value={form.examType}
              onChange={(e) =>
                setForm({ ...form, examType: e.target.value })
              }
            >
              <option value="internal">Internal</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
            </select>

            <button className="bg-indigo-600 text-white px-4 py-2 rounded">
              Save Marks
            </button>
          </form>
        </main>
      </div>
    </>
  );
};

export default EnterMarks;
