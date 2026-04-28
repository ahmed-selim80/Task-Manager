const mongoose = require("mongoose");
const User = require("./userModel");


const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true , 'Task MUST have a title'],
        trim: true,
        minlength: [3, 'Task title must be at least 3 characters'],
        maxlength: [100, 'Task title must be less than 100 characters']
    },

    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description must be less than 500 characters']
    },

    status: {
        type: String,
        enum: {
            values: ['todo', 'in-progress', 'done'],
            message: 'Status must be todo, in-progress, or done'
        },
        default: 'todo'
    },

    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high'],
            message: 'Priority must be low, medium, or high'
        },
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

taskSchema.pre("save" , () => {
    // if he has modified anything other than password , we don't wanna hash it again
    if(!this.isModified()) return;

    // other than that update updatedAt
    this.updatedAt = Date.now();
})

// to make it easy to find users 
taskSchema.index({ user: 1, createdAt: -1 });

// improves search
taskSchema.index({ user: 1, title: 1 });


const Task = mongoose.model("Task" , taskSchema);
module.exports = Task;