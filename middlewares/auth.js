const createError = require("../utils/errorhander");
const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');

module.exports.isAutherenticatedUser = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from Bearer scheme
    
    if (!token) {
        return res.status(401).json({ success: false, data: {}, message: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, data: {}, message: "User not found" });
        }
        req.user = user ;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ success: false, data: {}, message: 'Invalid token.' });
    }
};

module.exports.Autherizeroles = (...roles) => {
    return (req, res, next) => {
        // Check if user has required role
        if (!roles.includes(req.user.role)) {
            return next(createError(`Role ${req.user?.role} is not allowed to access this resource`, 406));
        }
        next();
    };
};