const express = require("express");

// Error handling 
const globalErrorHandler = require(`${__dirname}/controllers/errorController`);
const AppError = require(`${__dirname}/utils/appError`);

// Routers
const userRouter = require(`${__dirname}/routes/userRoutes`);
const taskRouter = require(`${__dirname}/routes/taskRoutes`);
const authRouter = require(`${__dirname}/routes/authRoutes`);


const app = express();

app.use(express.json());


app.use(`/api/v1/auth` , authRouter);
app.use(`/api/v1/users` , userRouter);
app.use(`/api/v1/tasks` , taskRouter);


// 404 handler for unknown routes
app.all("/{*splat}" , (req , res , next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server` , 404)); // 404 -> Not found
});


app.use(globalErrorHandler);

module.exports = app;