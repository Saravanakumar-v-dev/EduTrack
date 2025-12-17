import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import axios from "../../api/axios";

const TeacherDashboard = () => {
  const [data, setData] = useState({
    assignedStudents: 0,
    subjectsHandled: 0,
  });

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const { data } = await axios.get("/api/analytics/teacher");
        setData(data);
      } catch (error) {
        console.error("Failed to load teacher dashboard", error);
      }
    };
    fetchTeacherData();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-content">
          <h2>Teacher Dashboard</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Assigned Students</h3>
              <p>{data.assignedStudents}</p>
            </div>

            <div className="stat-card">
              <h3>Subjects Handled</h3>
              <p>{data.subjectsHandled}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherDashboard;
