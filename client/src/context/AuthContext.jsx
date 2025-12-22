import React, { createContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService"; // Ensure this service exists
import { toast } from "react-hot-toast"; 

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage first to prevent flash of loading state
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  }); 
  const [loading, setLoading] = useState(!localStorage.getItem('user')); 

  // CRITICAL: Checks for a valid session by requesting the protected user profile.
  const checkUserSession = useCallback(async () => {
    if (!loading && user) return; // Skip if we already have user data
    
    setLoading(true);
    try {
      // Calls /api/auth/profile. If the request succeeds (200 OK), 
      // the JWT cookie was valid and sent by the browser.
      const userData = await authService.getUserProfile(); 
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      // Fails if no cookie is present or expired (401 Unauthorized).
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, [loading, user]);

  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  // Function called by Login component AFTER the API request is successful.
  // It receives the user object directly from the login API response (res.data).
  const login = (userData) => { // UserData = {_id, name, email, role}
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast.success("Logged in successfully!");
    
    // Preload the next likely route based on user role
    if (userData.role === 'student') {
      preloadRoute('/profile');
    } else {
      preloadRoute('/dashboard');
    }
  };

  // Logout function with state cleanup
  const logout = async () => {
    try {
      await authService.logoutUser(); 
      // Clear all auth-related state and storage
      setUser(null);
      localStorage.removeItem('user');
      sessionStorage.removeItem('redirectPath');
      // Clear any other cached data
      localStorage.removeItem('cachedData');
      localStorage.removeItem('lastRoute');
      
      // Reset loading state
      setLoading(false);
      
      toast.success("Logged out successfully.");
      
      // Use a clean redirect to login
      window.location.replace('/login');
    } catch (error) {
      console.error("Logout failed at API level:", error);
      toast.error("Logout failed, please try again.");
      // Force logout even if API call fails
      setUser(null);
      localStorage.clear(); // Clear all local storage as a safety measure
      window.location.replace('/login');
    }
  };

  const isLoggedIn = !!user;

  const value = {
    user,
    loading,
    login,
    logout,
    isLoggedIn,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
        <p className="ml-4 text-indigo-600">Checking session...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
