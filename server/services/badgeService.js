/**
 * Determine which badge a student earns based on performance
 * @param {number} averageScore
 * @returns {string} Badge name
 */
export const assignBadge = (averageScore) => {
  if (averageScore >= 90) return "🏆 Excellence Award";
  if (averageScore >= 75) return "⭐ Consistent Performer";
  if (averageScore >= 60) return "📘 Hard Worker";
  if (averageScore >= 40) return "⚡ Improvement Zone";
  return "🚀 Keep Trying";
};

/**
 * Get badge message for display
 * @param {string} badge
 * @returns {string}
 */
export const badgeMessage = (badge) => {
  const messages = {
    "🏆 Excellence Award": "Outstanding achievement! Keep inspiring others.",
    "⭐ Consistent Performer": "Your dedication is paying off.",
    "📘 Hard Worker": "Persistence leads to success!",
    "⚡ Improvement Zone": "You’re on the right track — stay focused.",
    "🚀 Keep Trying": "Don’t give up! You can do better next time.",
  };
  return messages[badge] || "Keep learning every day!";
};