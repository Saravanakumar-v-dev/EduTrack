import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import "./index.css";

/* ===================================================
   THEME INITIALIZATION
=================================================== */
const initializeTheme = () => {
  try {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (err) {
    console.error("Theme initialization failed:", err);
  }
};

initializeTheme();

/* ===================================================
   APP BOOTSTRAP
=================================================== */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <App />

            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: "10px",
                  background: "#1f2937",
                  color: "#fff",
                },
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
