const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./userModel");


const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true , 'A task MUST have a title'],
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    status: {
        type: String,
        enum: ['todo' , 'in-progress' , 'done'],
        default: 'todo'
    },

    priority: {
        type: String,
        enum: ['low' , 'medium' , 'high'],
        default: 'medium'
    },

    dueDate: Date,

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: Date,

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true , 'Task must belong to a user']
    }
});

// to make it easy to find users 
taskSchema.index({ user: 1, createdAt: -1 });

// To make sure the user has ONE running task by the same title and improves search
taskSchema.index({ user: 1, title: 1 } , {unique: true});


const Task = mongoose.model("Task" , taskSchema);
module.exports = Task;