import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Crucial for HttpOnly cookies
});

// Request interceptor:
// REMOVED Authorization header logic. 
// The browser handles the 'jwt' cookie automatically because of withCredentials: true.
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor:
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    
    // --- CRITICAL FIX IS HERE ---
    const isAuthPage = window.location.pathname === '/login' ||
                       window.location.pathname === '/register' ||
                       window.location.pathname === '/forgot-password-code' ||
                       window.location.pathname === '/reset-password';

    // Check if the error is 401 AND we are NOT already on one of the auth pages.
    if (error.response?.status === 401 && !isAuthPage) {
      console.error("Unauthorized session or expired token. Redirecting to login.");
      
      // Clear any stale user info from local storage (if you store it)
      localStorage.removeItem("user"); 
      
      // Redirect to login
      window.location.href = "/login";
    }
    // --- END FIX ---
    
    // For 401s on auth pages (like the initial session check in AuthContext), 
    // just pass the error back to the component that made the call.
    return Promise.reject(error);
  }
);

export default instance;