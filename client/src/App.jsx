import React, { useContext } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Loader as LoaderIcon, Menu } from "lucide-react";

/* ===================== PAGES ===================== */
import AuthPage from "./pages/auth/AuthPage.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";

import StudentDashboard from "./pages/dashboard/StudentDashboard.jsx";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard.jsx";
import AdminDashboard from "./pages/dashboard/AdminDashboard.jsx";

import Analytics from "./pages/analytics/Analytics.jsx";
import Reports from "./pages/reports/Reports.jsx";
import StudentProfile from "./pages/students/StudentProfile.jsx";
import AdminProfile from "./pages/admin/AdminProfile.jsx";
import Settings from "./pages/settings/Settings.jsx";
import Assignments from "./pages/assignments/Assignments.jsx";

import AccessDenied from "./pages/AccessDenied.jsx";
import SessionExpired from "./pages/SessionExpired.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import NotFound from "./pages/NotFound.jsx";
import LandingPage from "./pages/LandingPage.jsx";

/* ===================== COMPONENTS ===================== */
import Sidebar from "./components/common/Sidebar.jsx";

/* ===================== CONTEXT ===================== */
import { AuthContext } from "./context/AuthContext.jsx";

/* ===================================================
   LOADER
=================================================== */
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <LoaderIcon className="w-6 h-6 animate-spin text-indigo-600" />
  </div>
);

/* ===================================================
   MAIN LAYOUT (Sidebar + Content)
=================================================== */
const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
        <div className="font-bold text-xl text-indigo-600 dark:text-indigo-400">EduTrack</div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -mr-2 text-gray-600 dark:text-gray-300"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar wrapper */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen z-40 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <Sidebar role={user?.role} logout={logout} onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 w-full p-6 lg:p-10 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

/* ===================================================
   PROTECTED ROUTE
=================================================== */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, user, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/403" replace />;
  }

  return <MainLayout />;
};

/* ===================================================
   ROLE-BASED DASHBOARD
=================================================== */
const RoleDashboard = () => {
  const { user } = useContext(AuthContext);

  switch (user?.role) {
    case "admin":
      return <AdminDashboard />;
    case "teacher":
      return <TeacherDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <Navigate to="/auth" replace />;
  }
};

import TeacherProfile from "./pages/teacher/TeacherProfile.jsx";

/* Role-based Profile Page */
const RoleProfile = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === "admin") {
    return <AdminProfile />;
  }
  if (user?.role === "teacher") {
    return <TeacherProfile />;
  }
  return <StudentProfile />;
};

/* Public Landing or Dashboard based on auth status */
const PublicOrDashboard = () => {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
};

/* ===================================================
   APP ROUTES
=================================================== */
const App = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />


      {/* ================= SYSTEM ================= */}
      <Route path="/403" element={<AccessDenied />} />
      <Route path="/session-expired" element={<SessionExpired />} />
      <Route path="/maintenance" element={<Maintenance />} />

      {/* ================= PROTECTED ================= */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin", "teacher", "student"]} />
        }
      >
        <Route path="/dashboard" element={<RoleDashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/assignments" element={<Assignments />} />
      </Route>

      {/* ================= PROFILE (All Roles) ================= */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "teacher", "student"]} />}>
        <Route path="/profile" element={<RoleProfile />} />
      </Route>

      {/* ================= ROOT / LANDING PAGE ================= */}
      <Route path="/" element={<PublicOrDashboard />} />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;


