const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const cloudinary = require('cloudinary');
const crypto = require('crypto');



// Register User => /api/v1/register

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;


    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: '150',
        crop: "scale"
    });
      
    const isUserExist = await User.findOne({email: email});
    
    if(isUserExist){
        return next(new ErrorHandler('Email Already Taken', 400))
    }
    
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res)
})

// Login User => /a[i/v1/login]
exports.loginUser = catchAsyncError( async(req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password is entered by user
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password', 400))
    }

    // Finding User in database
    const user = await User.findOne({ email }).select('+password') //because in user model we select password

    if(!user) {
        return next(new ErrorHandler('User Not Found.', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Incorrect Password', 401)) 
    }

    sendToken(user, 200, res)

 })

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next(new ErrorHandler('User not found with this email', 404)) 
    }

    // get reset token 
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false})

    // create reset password url 
    // const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`; for local run
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow: \n\n ${resetUrl}\n\nIf you have not requested this email
    , then ignore it.`

    try{
      
        await sendEmail({
            email: user.email, 
            subject: 'shopIT Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })
    } catch (error) {
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false})

        return next(new ErrorHandler(error.message, 500))
    }


})

//Reset Password 
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    //  Hash URL Token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('Hex');

    const user = await User.findOne({ 
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    })

    if(!user) {
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    //Setup new password 
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
})

// Get currently logged in user details => api/v1/me
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id); //atlogin we are storing id of user in session

    res.status(200).json({
        success: true,
        user
    })      
})

// Update / Change Password => /api/v1/password/update
exports.updatePassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password'); //at login we are storing id of user in session

    // Check old password
    const isMatched = await user.comparePassword(req.body.oldpassword); // comparePassword is a method in user model

    console.log('Helloooooo');

    if(!isMatched) {
        return next(new ErrorHandler('Old password is incorrect'));
    }

    user.password = req.body.password;

    console.log('old password is ' + req.body.oldpassword);
    console.log('New password is ' + user.password);

    await user.save(); 

    sendToken(user, 200, res);
})

// Update user profile => /api/v1/me/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email, 
    } 

    // Update avatar 
    if(req.body.avatar !== '') {
        const user = await User.findById(req.user._id);
        const image_id = user.avatar.public_id;
        const res = await cloudinary.v2.uploader.destroy(image_id);

        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: '150',
            crop: "scale"
        });
        
        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }
    
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, { 
        new: true, 
        runValidators: true,
        useFindAndModify: false 
    })

    res.status(200).json({
        success: true,
    })


})


//  Logout User => /api/v1/logout
exports.logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie('token', null, { 
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged Out'
    })
})

// Admin Routes

// Get all users /api/v1/admin/users
exports.allUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

// Get user details => /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user
    })
})

// Update user by admin => /api/v1/admin/user/:id 
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email, 
        role: req.body.role,
    } 

    // Update avatar : TODO
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, { 
        new: true, 
        runValidators: true,
        useFindAndModify: false 
    })

    res.status(200).json({
        success: true,
        user
    })
})

// Delete user => /api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`));
    }

    // Remove avatar from cloudinary : TODO
    await user.remove();

    res.status(200).json({
        success: true,
    })
})