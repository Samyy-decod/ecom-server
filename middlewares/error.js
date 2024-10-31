const createError = require('../utils/errorhander');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Handle MongoDB CastError (Invalid ObjectID)
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = createError(message, 400);  // Using the function instead of class
    }

     //worng jwt err
     if (err.name === "JsonWebTokenError") {
        const message = `json web Token is Invalid, try Again`;
        err = createError(message, 400);  // Using the function instead of class
    }
    
  // jwt EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `json web Token is Expired, try Again`;
    err = createError(message, 400);  // Using the function instead of class
}

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};
