import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generates a JWT and sets it as an HttpOnly cookie on the response object.
 *
 * @param {object} res - The Express response object.
 * @param {string} userId - The unique identifier for the user (e.g., MongoDB _id).
 * @param {string} role - The user's role ('student', 'teacher', 'admin').
 */
export const generateTokenAndSetCookie = (res, userId, role) => {
    // process.env.JWT_SECRET must be defined in your .env file
    const token = jwt.sign(
        { userId, role }, // Payload
        process.env.JWT_SECRET, // Secret key
        {
            expiresIn: '30d', // Token expiration time
        }
    );

    // Set the token as an HTTP-only cookie
    res.cookie('jwt', token, {
        httpOnly: true, // Prevents client-side JavaScript access
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevents CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
};

/**
 * Removes the JWT cookie from the response object.
 *
 * @param {object} res - The Express response object.
 */
export const clearTokenCookie = (res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), // Set expiration to the past to delete the cookie
    });
};

// No need for module.exports in ESM