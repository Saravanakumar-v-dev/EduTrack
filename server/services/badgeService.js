// server/services/badgeService.js

import Badge from "../models/Badge.js";

/* ======================================================
   BADGE RULE ENGINE
====================================================== */

/**
 * Determine badge based on academic performance
 * @param {number} averageScore
 * @returns {{ title: string, type: string, icon: string }}
 */
export const determinePerformanceBadge = (averageScore) => {
  if (averageScore >= 90)
    return {
      title: "Excellence Award",
      type: "performance",
      icon: "🏆",
    };

  if (averageScore >= 75)
    return {
      title: "Consistent Performer",
      type: "performance",
      icon: "⭐",
    };

  if (averageScore >= 60)
    return {
      title: "Hard Worker",
      type: "performance",
      icon: "📘",
    };

  if (averageScore >= 40)
    return {
      title: "Improvement Zone",
      type: "improvement",
      icon: "⚡",
    };

  return {
    title: "Keep Trying",
    type: "motivation",
    icon: "🚀",
  };
};

/* ======================================================
   BADGE MESSAGE GENERATOR
====================================================== */

/**
 * Get badge message for display
 * @param {string} title
 * @returns {string}
 */
export const badgeMessage = (title) => {
  const messages = {
    "Excellence Award":
      "Outstanding achievement! Keep inspiring others.",
    "Consistent Performer":
      "Your consistency and dedication are paying off.",
    "Hard Worker":
      "Persistence and effort will always lead to success.",
    "Improvement Zone":
      "You’re improving steadily — stay focused.",
    "Keep Trying":
      "Every step counts. Keep learning and growing.",
  };

  return messages[title] || "Keep pushing forward!";
};

/* ======================================================
   ASSIGN BADGE TO STUDENT (SAFE)
====================================================== */

/**
 * Automatically assign a badge to a student
 * Prevents duplicate badge awards
 *
 * @param {ObjectId} studentId
 * @param {number} averageScore
 * @param {ObjectId} awardedBy (teacher/admin)
 * @returns {Promise<Badge|null>}
 */
export const assignBadgeToStudent = async (
  studentId,
  averageScore,
  awardedBy
) => {
  const badgeData = determinePerformanceBadge(averageScore);

  // Prevent duplicate badge
  const alreadyAwarded = await Badge.findOne({
    user: studentId,
    title: badgeData.title,
  });

  if (alreadyAwarded) {
    return null;
  }

  const badge = await Badge.create({
    user: studentId,
    title: badgeData.title,
    type: badgeData.type,
    icon: badgeData.icon,
    description: badgeMessage(badgeData.title),
    awardedBy,
  });

  return badge;
};

/* ======================================================
   BULK BADGE ASSIGNMENT (CLASS / GRADE)
====================================================== */

/**
 * Assign badges to multiple students
 *
 * @param {Array<{ studentId, averageScore }>} students
 * @param {ObjectId} awardedBy
 * @returns {Promise<number>} count of new badges awarded
 */
export const assignBadgesInBulk = async (
  students,
  awardedBy
) => {
  let awardedCount = 0;

  for (const s of students) {
    const badge = await assignBadgeToStudent(
      s.studentId,
      s.averageScore,
      awardedBy
    );

    if (badge) awardedCount++;
  }

  return awardedCount;
};
