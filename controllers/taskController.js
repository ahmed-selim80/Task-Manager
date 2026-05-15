const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Task = require('../models/taskModel');
const APIFeatures = require('../utils/apiFeatures');
const filterObj = require('../utils/filterObj');

exports.createTask = catchAsync(async (req, res, next) => {
  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    user: req.user.id,
  });

  return res.status(201).json({
    status: 'success',
    data: {
      task,
    },
  });
});

exports.getAllTasks = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Task.find({ user: req.user.id }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tasks = await features.query;

  return res.status(200).json({
    status: 'success',
    results: tasks.length,
    data: {
      tasks,
    },
  });
});

exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!task) {
    return next(
      new AppError('No task found with that ID, or you do not have access to it', 404)
    );
  }

  return res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

exports.updateTask = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'title',
    'description',
    'status',
    'priority',
    'dueDate'
  );

  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user.id,
    },
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) {
    return next(
      new AppError('No task found with that ID, or you do not have access to it', 404)
    );
  }

  return res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!task) {
    return next(
      new AppError('No task found with that ID, or you do not have access to it', 404)
    );
  }

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTaskStats = catchAsync(async (req, res, next) => {
  const stats = await Task.aggregate([
    {
      $match: {
        user: req.user._id,
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  return res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});