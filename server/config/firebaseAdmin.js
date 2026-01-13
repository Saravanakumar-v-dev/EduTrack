import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

/* ======================================================
   FIREBASE ADMIN INITIALIZATION
   
   To get Firebase Admin credentials:
   1. Go to Firebase Console → Project Settings → Service Accounts
   2. Click "Generate new private key"
   3. Add the values to your .env file
====================================================== */

let firebaseInitialized = false;

export const initializeFirebaseAdmin = () => {
    if (firebaseInitialized) return;

    try {
        // Check if credentials are provided
        if (!process.env.FIREBASE_PROJECT_ID) {
            console.log("⚠️  Firebase Admin not configured (missing FIREBASE_PROJECT_ID)");
            return;
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                // Handle escaped newlines in private key
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });

        firebaseInitialized = true;
        console.log("✅ Firebase Admin initialized");
    } catch (error) {
        console.error("❌ Firebase Admin init error:", error.message);
    }
};

/* ======================================================
   VERIFY FIREBASE ID TOKEN
====================================================== */
export const verifyFirebaseToken = async (idToken) => {
    if (!firebaseInitialized) {
        throw new Error("Firebase Admin not initialized");
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        throw new Error("Invalid Firebase token");
    }
};

/* ======================================================
   GET FIREBASE USER BY UID
====================================================== */
export const getFirebaseUser = async (uid) => {
    if (!firebaseInitialized) {
        throw new Error("Firebase Admin not initialized");
    }

    try {
        const userRecord = await admin.auth().getUser(uid);
        return userRecord;
    } catch (error) {
        console.error("❌ Get user failed:", error.message);
        throw new Error("Firebase user not found");
    }
};

export default admin;
