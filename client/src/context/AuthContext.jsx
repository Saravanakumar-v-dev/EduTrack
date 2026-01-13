import {
  createContext,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import axios from "../api/axios";

/* ===================================================
   CONTEXT
=================================================== */
export const AuthContext = createContext(null);

/* ===================================================
   CUSTOM HOOK
=================================================== */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

/* ===================================================
   PROVIDER
=================================================== */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------------
     Fetch logged-in user from cookie (session restore)
  --------------------------------------------------- */
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await axios.get("/auth/profile");
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ---------------------------------------------------
     Login (STATE ONLY – API already called in service)
  --------------------------------------------------- */
  const login = (userData) => {
    setUser(userData);
  };

  /* ---------------------------------------------------
     Logout
  --------------------------------------------------- */
  const logout = async () => {
    try {
      await axios.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  /* ---------------------------------------------------
     Update Profile
  --------------------------------------------------- */
  const updateProfile = async (payload) => {
    const { data } = await axios.put("/auth/profile", payload);
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        logout,
        updateProfile,
        refreshUser: fetchProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
