const jwt = require("jsonwebtoken");
const User = require("../models/user");   
const catchAsyncErrors = require('./catchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');

// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {

    const { token } = req.cookies;

    if(!token) {
        return next(new ErrorHandler('Login first to access resource', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id) //decoded id cuz we stored id in token

    next();
})


// Handling user roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(
            new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`, 403)
            )}

        next()
    }
}
