// @desc    Handles 404 Not Found errors
// @access  Public
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the main error handler
};

/**
 * @desc    Generic error handler middleware
 * @access  Public
 * This is the final safety net for all errors passed via next(error)
 */
const errorHandler = (err, req, res, next) => {
    // Determine the status code: use the existing status or default to 500 (Server Error)
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Check for Mongoose Bad ObjectId (Common error, especially with route params)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404; // Treat a bad ID as 'Not Found'
        message = 'Resource not found or invalid ID format.';
    }

    res.status(statusCode).json({
        message: message,
        // Only include the stack trace in development mode for debugging
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
};

export { notFound, errorHandler };