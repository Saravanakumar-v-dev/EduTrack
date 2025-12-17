import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// --- Import Routes ---
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// --- Initialize Environment & DB ---
dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// --- CORS CONFIGURATION ---
const allowedOrigins = [
    'http://localhost:5173',        // Local frontend (Vite)
    'http://127.0.0.1:5173',        // Alternate local host
    process.env.FRONTEND_URL         // Production frontend URL (optional)
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));

// --- CORE MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- HEALTH CHECK / ROOT ROUTE ---
app.get('/', (req, res) => {
    res.send(`✅ EduTrack API is running successfully on port ${PORT}`);
});

// --- ROUTE DEFINITIONS ---
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/reports', reportRoutes);

// --- ERROR HANDLING MIDDLEWARE ---
app.use(notFound);
app.use(errorHandler);

// --- START THE SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
