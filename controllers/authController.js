const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const crypto = require('crypto');
const email = require(`./../utils/email`);



const signTokenAndSend =  function (statusCode , user , res){
    // assigning the user a token to log him in
    const token = jwt.sign({id: user._id} , process.env.JWT_SECRET , {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    // to avoid leaking the password
    user.password = undefined;

    // 201 -> Created
    return res.status(statusCode).json({
        status: "success",
        user,
        jwt: token
    });
}

module.exports.protect = catchAsync (async (req , res , next) => {
    let token;

    // Checking to see if the token exists or not
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.get('Authorization').split(" ")[1];
    }
    
    // Checking to see if token got assigned or not
    if(!token){
        return next(new AppError(`You don't have permission to perform this action` , 401)) // 401 -> not logged in , invalid token
    }

    // Checking invalid token
    const decoded = jwt.verify(token , process.env.JWT_SECRET);

    // Checking expired token
    if(decoded.exp * 1000 < Date.now()){
        return next(new AppError('Token Expired' , 400)) // 400 -> Bad Request
    };

    const user = await User.findById(decoded.id).select("+active");

    // checking if user doesn't exist or has deleted their account
    if(!user || user.active === false){
        return next(new AppError(`No user found` , 404));
    }

    // Checking if user changed password after token has been issued
    if (user.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password. Please log in again.', 401)
        );
    }

    
    // attaching the user on the request
    req.user = user;

    next();
})

module.exports.restrictTo = (...roles) => (req , res , next) => {
    // roles = ['user' , 'admin'] for instance

    if(!roles.includes(req.user.role)){
        return next(new AppError(`You don't have authority to perform this action` , 403));
    }

    // Otherwise you do have authority -> move on to the next middleware
    next();
}


module.exports.signup = catchAsync (async (req , res , next) => {

    // 1) Check if input has email and password
    if(!req.body.email || !req.body.password){
        return next(new AppError("You must enter email and password" , 400)); // 400 -> bad request
    }


    // 2) create user and save to the database and don't include anything malicious like role
    const user = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })

    return signTokenAndSend(201 , user , res);
});


module.exports.login = catchAsync (async (req , res , next) => {
    // get user
    const user =  await User.findOne({email : req.body.email}).select("+password");

    // check if user exists
    if(!user || !await user.passwordsMatch(req.body.password , user.password)){
        return next(new AppError("Incorrect email or password" , 401)) // 401 -> failed authentication
    }

    // if everything is fine
    return signTokenAndSend(200 , user , res);
});



module.exports.forgotPassword = catchAsync (async (req , res , next) => {
    const user = await User.findOne({email : req.body.email});

    // checking if user exists or not
    if (!user) return next(new AppError('No user with that email', 404)); // 404 -> Not Found

    const resetToken = await user.createPasswordResetToken();
    
    // saves the hashed reset token on the user document
    await user.save({ validateBeforeSave: false });

    // message to be send in the email body
    const message = `This is reset password token: ${resetToken}`;

    try{
        // sending the email to the user with the reset password token
        await email.sendResetPasswordEmail({email : user.email , subject: "Reset Password Token" , message : message});

        return res.status(200).json({
            status: "success",
            message: "Please check your email for reset password token"
        })
    }

    catch(err){
        user.resetPasswordToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save({ validateBeforeSave: false });

        return next(
        new AppError('There was a problem sending the email. Try again later.', 500)
        );
    }
});



module.exports.resetPassword = catchAsync (async (req , res , next) => {
    const token = req.params.token;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Finding the user by the token and checking if the user is correct and if it had expired
    const user = await User.findOne({resetPasswordToken: hashedToken , passwordResetExpires: {$gt: Date.now()}});

    // Checking if user exists
    if (!user) return next(new AppError('Token is invalid or has expired', 404)); // 404 -> Not Found

    if( !req.body.password || !req.body.passwordConfirm ||req.body.password !== req.body.passwordConfirm){
        return next(new AppError('Please enter matching password and passwordConfirm' , 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    user.resetPasswordToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({runValidators: true});

    // signing the user in
    return signTokenAndSend(200 , user , res);
});
