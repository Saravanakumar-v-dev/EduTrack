import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import axios from "../../api/axios";

const StudentDashboard = () => {
  const [profile, setProfile] = useState({
    name: "",
    department: "",
    subjectsCount: 0,
  });

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const { data } = await axios.get("/api/students/me");
        setProfile({
          name: data.name,
          department: data.department,
          subjectsCount: data.subjects?.length || 0,
        });
      } catch (error) {
        console.error("Failed to load student dashboard", error);
      }
    };
    fetchStudentProfile();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-content">
          <h2>Student Dashboard</h2>

          <div className="profile-card">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Department:</strong> {profile.department}</p>
            <p><strong>Enrolled Subjects:</strong> {profile.subjectsCount}</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
