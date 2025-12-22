import React, { useContext } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Loader as LoaderIcon, LogOut, LayoutDashboard, BarChart, FileText, Settings as SettingsIcon, UserCircle, Users } from 'lucide-react'; // Renamed Settings import
import { motion } from 'framer-motion';

// --- ACTUAL COMPONENT IMPORTS ---
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ForgotPasswordCode from './pages/ForgotPasswordCode.jsx';
import Dashboard from './pages/Dashboard.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import Analytics from './pages/Analytics.jsx';
import Sidebar from './components/Sidebar.jsx';
import NotFound from './pages/NotFound.jsx';
import Settings from './pages/Settings.jsx'; // <-- Assuming you have this file now

// --- IMPORT THE REAL AUTH CONTEXT ---
import { AuthContext } from './context/AuthContext.jsx'; 

// --- MOCK/PLACEHOLDER DEFINITIONS (for AuthContext and unbuilt pages) ---
// Mock components for pages not yet built, to prevent errors
const AdminPanel = () => <div className="p-8 text-xl text-gray-700 dark:text-gray-300">Admin Panel Page (Mock)</div>;
const Reports = () => <div className="p-8 text-xl text-gray-700 dark:text-gray-300">Reports Page (Mock)</div>;
// const Settings = () => ... // <-- CRITICAL FIX: This line has been deleted.

// --- END MOCK/PLACEHOLDER DEFINITIONS ---


// ====================================================================
// CORE COMPONENTS
// ====================================================================



/**
 * Main Layout Component for authenticated users.
 */
const MainLayout = () => {
    const { user, logout } = useContext(AuthContext); // Uses REAL context
    const role = user?.role || 'student'; 

    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Using the standalone Sidebar component */}
            <Sidebar role={role} logout={logout} /> 
            <main className="flex-1 p-6 lg:p-10 overflow-auto custom-scroll"> {/* custom-scroll from index.css */}
                <Outlet />
            </main>
        </div>
    );
};

/**
 * Protected Route Component
 * Handles redirection based on authentication status and user role.
 */
const ProtectedRoute = ({ allowedRoles }) => {
    const { isLoggedIn, user } = useContext(AuthContext);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    const userRole = user?.role;
    
    if (userRole && allowedRoles.includes(userRole)) {
        return <MainLayout />; // User is logged in AND authorized
    } else {
        // User is logged in but NOT authorized for this route
        if (userRole === 'student') {
            return <Navigate to="/profile" replace />;
        }
        return <Navigate to="/" replace />; // Default for admin/teacher
    }
};

/**
 * Component to handle the initial redirect logic after login based on role.
 */
const InitialRedirect = () => {
    const { user, loading } = useContext(AuthContext); // Uses REAL context

    if (loading) {
        return <Loader />;
    }

    const userRole = user?.role;

    if (userRole === 'student') {
        return <Navigate to="/profile" replace />;
    }
    // Default redirect for admin and teacher
    return <Navigate to="/dashboard" replace />;
}

// ====================================================================
// MAIN APP COMPONENT
// ====================================================================

const App = () => {
    return (
        // The real AuthProvider is in main.jsx
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} /> 
            <Route path="/forgot-password-code" element={<ForgotPasswordCode />} />
            <Route path="/404" element={<NotFound />} />

            {/* Teacher/Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher']} />}>
                <Route path="/dashboard" element={<Dashboard />} /> 
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reports" element={<Reports />} />
            </Route>

            {/* Admin Only Routes */}
             <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminPanel />} />
            </Route>

            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/profile" element={<StudentProfile />} />
            </Route>
            
            {/* Shared settings route (all roles can access) */}
             <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']} />}>
                 <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Root path ("/") redirector for logged-in users */}
            <Route path="/" element={
                <ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}>
                    <InitialRedirect />
                </ProtectedRoute>
            } />
            
            {/* Fallback route for any path not matched */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;