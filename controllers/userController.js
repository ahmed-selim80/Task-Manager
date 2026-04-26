const User = require(`${__dirname}/../models/userModel`);
const AppError = require(`${__dirname}/../utils/appError`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);

// helper function to filter  body
const filterObj = require(`${__dirname}/../utils/filterObj`);


//  ADMIN OPERATIONS -------------------------------------------------------

module.exports.getUser = catchAsync (async (req, res , next) => {
    const user = await User.findById(req.params.id);

    if(!user) return next(new AppError("This user doesn't exist or wrong id" , 400)); // 400 -> bad request

    res.status(200).json({
        status: "success",
        user
    })
})


module.exports.updateUser = catchAsync (async (req, res , next) => {
    const filteredBody = filterObj(
        req.body,
        'name',
        'email',
        'role',
        'active'
    );

    const user = await User.findByIdAndUpdate(
        req.params.id,
        filteredBody,
        {
            new: true,
            runValidators: true
        }
    );

    if (!user) {
        return next(new AppError('No user found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        user
    });
})


module.exports.deleteUser = catchAsync (async (req, res , next) => {
    const user = await User.findByIdAndUpdate(req.params.id , {active: false});
    if(!user) return next(new AppError("This user doesn't exist or wrong id" , 404));

    return res.status(204).end();
})


module.exports.createUser = catchAsync (async (req , res) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    return res.status(201).json({
        status: "success",
        user
    })
});


module.exports.getAllUsers = catchAsync( async (req , res) => {
    const features = new APIFeatures(Task.find() , req.query).filter().sort().limitFields().paginate();
    // executing the query
    const tasks = await features.query;

    return res.status(200).json({
        status: "success",
        results: users.length,
        data: users
    })
});



// USER OPERATIONS ---------------------------------------------------------------

module.exports.deleteMe = catchAsync( async (req , res , next) => {
    const user = await User.findByIdAndUpdate(req.user.id , {active: false});
    return res.status(204).end();
})



module.exports.updateMe = catchAsync( async (req , res , next) => {
    const filteredBody = filterObj(req.body, 'name', 'email');

    const user = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            returnDocument: 'after',
            runValidators: true
        }
    );

    return res.status(200).json({
        status: "success",
        user
    });
})


module.exports.getMe = catchAsync (async (req , res , next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: "success",
        user
    })
})