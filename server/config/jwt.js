import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Generates JWT and sets HttpOnly cookie
 * @param {object} res - Express response
 * @param {string} userId - MongoDB _id
 */
export const generateTokenAndSetCookie = (res, userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined in environment");
  }

  const token = jwt.sign(
    { id: userId }, // ✅ FIXED PAYLOAD
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

/**
 * Clears JWT cookie
 */
export const clearTokenCookie = (res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};
