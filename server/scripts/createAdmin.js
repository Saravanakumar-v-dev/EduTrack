import mongoose from "mongoose";
import dotenv from "dotenv";
import admin from "firebase-admin";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { initializeFirebaseAdmin } from "../config/firebaseAdmin.js";

// Initialize Firebase Admin
initializeFirebaseAdmin();

if (!admin.apps.length) {
    console.error("Failed to initialize Firebase Admin.");
    console.log("Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are correctly set and uncommented in your .env file.");
    process.exit(1);
}

// Admin Details Configuration
const ADMIN_EMAIL = "admin@edutrack.com";
const ADMIN_PASSWORD = "AdminPassword123!"; // Change this after first login
const ADMIN_NAME = "System Admin";

const createAdminUser = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected.");

        // Check if admin already exists in MongoDB
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
        if (existingAdmin) {
            console.log(`\nAdmin user already exists in MongoDB with email: ${ADMIN_EMAIL}`);
            console.log("You can log in with this email.");
            process.exit(0);
        }

        console.log(`\nCreating Firebase Auth user for ${ADMIN_EMAIL}...`);
        let firebaseUser;
        try {
            // Try to get user if they already exist in Firebase
            firebaseUser = await admin.auth().getUserByEmail(ADMIN_EMAIL);
            console.log("User already exists in Firebase Auth.");
            // Optional: Update password just to be sure
            await admin.auth().updateUser(firebaseUser.uid, { password: ADMIN_PASSWORD });
            console.log("Updated Firebase password to default.");
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                // Create new Firebase user
                firebaseUser = await admin.auth().createUser({
                    email: ADMIN_EMAIL,
                    password: ADMIN_PASSWORD,
                    displayName: ADMIN_NAME,
                    emailVerified: true,
                });
                console.log("Created new Firebase Auth user.");
            } else {
                throw err;
            }
        }

        console.log("Creating Admin record in MongoDB...");
        const newAdmin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD, 
            role: "admin",
            firebaseUid: firebaseUser.uid,
            isVerified: true
        });

        console.log("\n=============================================");
        console.log("✅ MASTER ADMIN ACCOUNT CREATED SUCCESSFULLY");
        console.log("=============================================");
        console.log(`Email:    ${ADMIN_EMAIL}`);
        console.log(`Password: ${ADMIN_PASSWORD}`);
        console.log("---------------------------------------------");
        console.log("⚠️  Please log in and change this password immediately!");

        process.exit(0);
    } catch (error) {
        console.error("\n❌ Error creating admin user:", error);
        process.exit(1);
    }
};

createAdminUser();
