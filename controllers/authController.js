const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");
const catchAsync = require(`${__dirname}/../utils/catchAsync`);




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
    const token = req.get('Authorization').split(" ")[1];
    
    if(!token){
        return next(new AppError(`You don't have permission to perform this action` , 403)) // 403 -> forbidden
    }

    const user = await User.findById(jwt.decode(token).id);

    if(!user){
        return next(new AppError(`No user found` , 400));
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
        return next(new AppError("Incorrect email or password" , 400)) // 400 -> bad request
    }

    // if everything is fine
    return signTokenAndSend(200 , user , res);
});