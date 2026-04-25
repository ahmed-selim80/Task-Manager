const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require(`./../utils/catchAsync`);


// For Admin
module.exports.createUser = catchAsync (async (req , res) => {
    const user = await User.create(req.body);

    return res.status(201).json({
        status: "success",
        user
    })
});

// For Admin
module.exports.getAllUsers = catchAsync( async (req , res) => {
    const users = await User.find();

    return res.status(200).json({
        status: "success",
        data: users
    })
});

module.exports.deleteMe = catchAsync( async (req , res , next) => {
    const user = await User.findByIdAndUpdate(req.user.id , {active: false});
    return res.status(204).end();
})



module.exports.updateMe = catchAsync( async (req , res , next) => {

    if(req.body.password || req.body.passwordConfirm) return next(new AppError(`You can't change your password here, please use "resetPassword"` , 403));

    console.log("Before updating user");

    const user = await User.findByIdAndUpdate(req.user.id , {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,  
    } , {new: true , runValidators: true})

    console.log("after updating");

    return res.status(200).json({
        status: "success",
        user
    });
})


module.exports.getMe = catchAsync (async (req , res , next) => {
    console.log("SDfsdfsf")
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: "success",
        user
    })
})


module.exports.getUser = catchAsync (async (req, res , next) => {
    const user = await User.findById(req.url.replace('/' , ''));

    if(!user) return next(new AppError("This user doesn't exist or wrong id" , 400)); // 400 -> bad request

    res.status(200).json({
        status: "success",
        user
    })
})


module.exports.updateUser = catchAsync (async (req, res , next) => {

    const user = await User.findByIdAndUpdate(req.url.replace('/' , ''));

    User.findByIdAndUpdate(user.id , {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        password: req.body.password || user.password,
        passwordConfirm: req.body.passwordConfirm || user.passwordConfirm,
        role: req.body.role || user.role 
    }, {new: true , runValidators: true})


    return res.status(200).json({
        status: "success",
        user
    });
})



module.exports.deleteUser = catchAsync (async (req, res , next) => {
    const user = await User.findByIdAndUpdate(req.url.replace('/' , '') , {active: false});
    if(!user) return next(new AppError("This user doesn't exist or wrong id" , 400)); // 400 -> bad request

    return res.status(204).end();
})

