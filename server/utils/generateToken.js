import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  if (!userId) {
    throw new Error("Token payload missing userId");
  }

  const token = jwt.sign(
    { userId }, // ✅ AUTH ONLY
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export const clearTokenCookie = (res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });
};
