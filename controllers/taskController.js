const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const Task = require(`${__dirname}/../models/taskModel`);

// helper function to filter  body
const filterObj = require(`${__dirname}/../utils/filterObj`);

exports.createTask = catchAsync (async (req , res , next) => {
    // Attaching the task to its user
    req.body.user = req.user.id;

    const task = await Task.create(req.body);

    return res.status(201).json({
        status: "success",
        task
    })
});


exports.getAllTasks = catchAsync (async (req , res , next) => {
    const tasks = await Task.find({user: req.user.id});

    return res.status(200).json({
        status: "success",
        data : {tasks}
    });
});


exports.getTask = catchAsync (async (req , res , next) => {
    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    // checking if the task belongs to the logged in user
    if(!task){
        return next(new AppError(`No task found with that ID, or you do not have access to it` , 404))
    }

    return res.status(200).json({
        status: "success",
        task
    })
});


exports.updateTask = catchAsync (async (req , res , next) => {
    
    const filteredBody = filterObj(
        req.body , 
        'title',
        'description',
        'status',
        'priority',
        'dueDate'
    );
    
    // updating the task
    const updatedTask = await Task.findOneAndUpdate(
        {
            _id: req.params.id,
            user: req.user.id
        },
        filteredBody,
        {
            returnDocument: 'after',
            runValidators: true
        }
    );

    // checking if the task belongs to the logged in user
    if(!updatedTask){
        return next(new AppError(`No task found with that ID, or you do not have access to it` , 404))
    }

    
    return res.status(200).json({
        status: "success",
        updatedTask
    })
});


exports.deleteTask = catchAsync (async (req , res , next) => {
    const task = await Task.findOne({
        _id: req.params.id,
        user: req.user.id
    });

    // checking if the task belongs to the logged in user
    if(!task){
        return next(new AppError(`No task found with that ID, or you do not have access to it` , 404))
    }

    await Task.findByIdAndDelete(task.id);

    return res.status(204).end()
});

