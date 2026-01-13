import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { initializeFirebaseAdmin } from "./config/firebaseAdmin.js";

// --- Import Routes ---
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import markRoutes from "./routes/markRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// --- Initialize Environment & DB ---
dotenv.config();
connectDB();

// --- Initialize Firebase Admin (for phone auth) ---
initializeFirebaseAdmin();

const app = express();
const PORT = process.env.PORT || 5000;

/* ======================================================
   CORS CONFIGURATION (FRONTEND CONNECTIVITY)
====================================================== */

const allowedOrigins = [
  "http://localhost:5173",       // Vite frontend
  "http://localhost:5174",       // Vite fallback ports
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5176",
  process.env.FRONTEND_URL,      // Production frontend
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow REST tools like Postman (no origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true, // 🔑 REQUIRED FOR COOKIES
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

/* ======================================================
   CORE MIDDLEWARE
====================================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


/* ======================================================
   HEALTH CHECK
====================================================== */

app.get("/", (req, res) => {
  res.send(`✅ EduTrack API running on port ${PORT}`);
});

/* ======================================================
   ROUTES
====================================================== */

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admin", adminRoutes);

/* ======================================================
   ERROR HANDLING
====================================================== */

app.use(notFound);
app.use(errorHandler);

/* ======================================================
   START SERVER
====================================================== */

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});
