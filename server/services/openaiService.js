import OpenAI from "openai";
import dotenv from "dotenv";
import Logger from "./loggerService.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate AI-based study advice or performance feedback
 * @param {string} studentName
 * @param {object} grades - subject: marks mapping
 * @returns {Promise<string>}
 */
export const generateAISuggestions = async (studentName, grades) => {
  const gradeSummary = Object.entries(grades)
    .map(([subject, score]) => `${subject}: ${score}`)
    .join(", ");

  const prompt = `
  Analyze this student's performance and provide short advice.
  Student: ${studentName}
  Grades: ${gradeSummary}
  Suggest study areas and motivational advice.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    Logger.error("OpenAI API call failed", error);
    throw new Error(`OpenAI API call failed: ${error.message}`);
    return "AI analysis unavailable at the moment.";
  }
};