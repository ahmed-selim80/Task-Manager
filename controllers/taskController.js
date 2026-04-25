const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const Task = require(`${__dirname}/../models/taskModel`);
const jwt = require('jsonwebtoken');


exports.createTask = catchAsync (async (req , res , next) => {
    // Attaching the task to its user
    req.body.user = req.user.id;

    const task = await Task.create(req.body);

    return res.status(200).json({
        status: "success",
        task
    })
});


exports.getAllTasks = catchAsync (async (req , res , next) => {
    const tasks = await Task.find({user: jwt.decode(req.get('Authorization').split(" ")[1]).id});

    return res.status(200).json({
        status: "success",
        data : {tasks}
    });
});


exports.getTask = catchAsync (async (req , res , next) => {
    const task = await Task.findById(req.url.replace('/' , ''));

    // checking if the task belongs to the logged in user
    if(! (task.user.toString() === jwt.decode(req.get('Authorization').split(" ")[1]).id)){
        return next(new AppError(`You don't have access to this task` , 403)) // 403 -> forbidden
    }

    return res.status(200).json({
        status: "success",
        task
    })
});


exports.updateTask = catchAsync (async (req , res , next) => {
    const task = await Task.findById(req.url.replace('/' , ''));

    // checking if the task belongs to the logged in user
    if(! (task.user.toString() === jwt.decode(req.get('Authorization').split(" ")[1]).id)){
        return next(new AppError(`You don't have access to this task` , 403)) // 403 -> forbidden
    }

    
    // updating the task
    const updatedTask = await Task.findByIdAndUpdate(
        task.id,
        {
            title: req.body.title || task.title,
            description: req.body.description || task.description,
            status: req.body.status || task.status,
            priority: req.body.priority || task.priority,
            dueDate: req.body.dueDate || task.dueDate,
            updatedAt: Date.now()
        },
        {
            returnDocument: 'after',
            runValidators: true
        }
    );

    
    return res.status(200).json({
        status: "success",
        updatedTask
    })
});


exports.deleteTask = catchAsync (async (req , res , next) => {
    const task = await Task.findById(req.url.replace('/' , ''));

    // checking if the task belongs to the logged in user
    if(! (task.user.toString() === jwt.decode(req.get('Authorization').split(" ")[1]).id)){
        return next(new AppError(`You don't have access to this task` , 403)) // 403 -> forbidden
    }

    await Task.findByIdAndDelete(task.id);

    return res.status(204).end()
});

