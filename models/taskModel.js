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
        enum: ['todo' , 'in-progress' , 'done']
    },

    priority: {
        type: String,
        enum: ['low' , 'medium' , 'high']
    },

    dueDate: Date,

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: Date,

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
});

// to make it easy to find users 
taskSchema.index({ user: 1, createdAt: -1 });

// To make sure the user has ONE running task by the same title
taskSchema.index({ user: 1, title: 1 });


const Task = mongoose.model("Task" , taskSchema);
module.exports = Task;