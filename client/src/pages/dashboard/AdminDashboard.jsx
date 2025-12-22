import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import axios from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const { data } = await axios.get("/api/analytics/admin");
        setStats(data);
      } catch (error) {
        console.error("Failed to load admin stats", error);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-content">
          <h2>Admin Dashboard</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Students</h3>
              <p>{stats.totalStudents}</p>
            </div>

            <div className="stat-card">
              <h3>Total Teachers</h3>
              <p>{stats.totalTeachers}</p>
            </div>

            <div className="stat-card">
              <h3>Total Subjects</h3>
              <p>{stats.totalSubjects}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
