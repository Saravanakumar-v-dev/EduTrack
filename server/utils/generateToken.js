import jwt from 'jsonwebtoken';

// Function to generate a JWT and set it as an HTTP-only cookie
const generateToken = (res, userId) => {
    // 1. Generate the token
    const token = jwt.sign(
        { userId }, // The payload (data to store in the token)
        process.env.JWT_SECRET, // Secret key from .env file
        {
            expiresIn: '30d', // Token expiration time (e.g., 30 days)
        }
    );

    // 2. Set the token as an HTTP-only cookie
    res.cookie('jwt', token, {
        httpOnly: true, // Prevents client-side JavaScript access (security)
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'strict', // Prevents CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
};

// CRITICAL FIX: Use ES Module default export
export default generateToken;