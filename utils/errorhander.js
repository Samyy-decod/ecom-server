// utils/errorHandler.js
const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;

    // Capture stack trace to help with debugging
    Error.captureStackTrace(error, createError);

    return error;
};

module.exports = createError;
