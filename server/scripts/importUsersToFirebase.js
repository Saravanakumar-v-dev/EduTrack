// server/scripts/importUsersToFirebase.js
// =========================================
// Imports existing MongoDB users into Firebase Auth
// Uses bcrypt hash import so users keep their existing passwords
//
// Usage: node scripts/importUsersToFirebase.js
// =========================================

import dotenv from "dotenv";
import mongoose from "mongoose";
import admin from "firebase-admin";
import User from "../models/User.js";

dotenv.config();

/* ======================================================
   INITIALIZE FIREBASE ADMIN
====================================================== */
if (!process.env.FIREBASE_PROJECT_ID) {
  console.error("❌ FIREBASE_PROJECT_ID not found in .env");
  console.error("   Add Firebase Admin credentials to your .env file first.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

console.log("✅ Firebase Admin initialized");

/* ======================================================
   CONNECT TO MONGODB
====================================================== */
await mongoose.connect(process.env.MONGO_URI);
console.log(`✅ Connected to MongoDB: ${mongoose.connection.host}`);

/* ======================================================
   IMPORT USERS WITH BCRYPT HASH PRESERVATION
====================================================== */
async function importUsersWithHashes() {
  // Find all verified users WITHOUT a firebaseUid
  // Select password field explicitly (it's select: false in schema)
  const usersToImport = await User.find({
    isVerified: true,
    email: { $exists: true, $ne: null },
    $or: [
      { firebaseUid: null },
      { firebaseUid: { $exists: false } },
    ],
  }).select("+password");

  console.log(`\n📋 Found ${usersToImport.length} users to import\n`);

  if (usersToImport.length === 0) {
    console.log("🎉 All users are already synced with Firebase!");
    return;
  }

  // Prepare users for Firebase import (batch of up to 1000)
  const usersForFirebase = [];
  const userMap = new Map(); // Track which MongoDB users we're importing

  for (const user of usersToImport) {
    if (!user.email) {
      console.log(`⏭️  Skipping ${user.name} - no email address`);
      continue;
    }

    const firebaseUserData = {
      uid: user._id.toString(), // Use MongoDB _id as Firebase UID
      email: user.email,
      displayName: user.name,
      emailVerified: true,
    };

    // If user has a password hash, include it for bcrypt import
    if (user.password) {
      firebaseUserData.passwordHash = Buffer.from(user.password);
    }

    usersForFirebase.push(firebaseUserData);
    userMap.set(user._id.toString(), user);
  }

  if (usersForFirebase.length === 0) {
    console.log("No eligible users to import.");
    return;
  }

  console.log(`🚀 Importing ${usersForFirebase.length} users to Firebase...\n`);

  try {
    // Firebase importUsers with bcrypt algorithm
    const result = await admin.auth().importUsers(usersForFirebase, {
      hash: {
        algorithm: "BCRYPT",
      },
    });

    console.log("=".repeat(50));
    console.log("📊 FIREBASE IMPORT RESULTS");
    console.log("=".repeat(50));
    console.log(`✅ Successfully imported: ${result.successCount}`);
    console.log(`❌ Failed to import:     ${result.failureCount}`);

    if (result.errors.length > 0) {
      console.log("\n⚠️  Import Errors:");
      result.errors.forEach((err) => {
        const user = usersForFirebase[err.index];
        console.error(`   [${err.index}] ${user?.email}: ${err.error.message}`);
      });
    }

    // Build set of failed indices for skipping
    const failedIndices = new Set(result.errors.map((e) => e.index));

    // Update MongoDB records with firebaseUid for successful imports
    let updateCount = 0;
    for (let i = 0; i < usersForFirebase.length; i++) {
      if (failedIndices.has(i)) continue;

      const fbUser = usersForFirebase[i];
      await User.updateOne(
        { _id: fbUser.uid },
        { $set: { firebaseUid: fbUser.uid } }
      );
      updateCount++;
    }

    console.log(`\n✅ Updated ${updateCount} MongoDB records with Firebase UIDs`);
  } catch (error) {
    console.error("❌ Bulk import failed:", error.message);
    
    // Fallback: Import one by one
    console.log("\n🔄 Falling back to individual import...\n");
    await importUsersIndividually(usersToImport);
  }
}

/* ======================================================
   FALLBACK: INDIVIDUAL USER IMPORT
====================================================== */
async function importUsersIndividually(users) {
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const user of users) {
    if (!user.email) {
      skipCount++;
      continue;
    }

    try {
      // Check if user already exists in Firebase
      let firebaseUser;
      try {
        firebaseUser = await admin.auth().getUserByEmail(user.email);
        console.log(`⚠️  ${user.email} already in Firebase (UID: ${firebaseUser.uid})`);
      } catch (err) {
        if (err.code === "auth/user-not-found") {
          // Create new Firebase user with a temporary password
          firebaseUser = await admin.auth().createUser({
            email: user.email,
            displayName: user.name,
            emailVerified: true,
            password: `EduTrack_Reset_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          });
          console.log(`✅ Created: ${user.email} (UID: ${firebaseUser.uid})`);
        } else {
          throw err;
        }
      }

      // Update MongoDB with Firebase UID
      await User.updateOne(
        { _id: user._id },
        { $set: { firebaseUid: firebaseUser.uid } }
      );
      successCount++;
    } catch (error) {
      console.error(`❌ ${user.email}: ${error.message}`);
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 INDIVIDUAL IMPORT SUMMARY");
  console.log("=".repeat(50));
  console.log(`✅ Success: ${successCount}`);
  console.log(`⏭️  Skipped: ${skipCount}`);
  console.log(`❌ Errors:  ${errorCount}`);
  console.log("=".repeat(50));
}

/* ======================================================
   RUN
====================================================== */
try {
  await importUsersWithHashes();
} catch (error) {
  console.error("\n💥 Fatal error:", error);
} finally {
  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB");
  process.exit(0);
}
