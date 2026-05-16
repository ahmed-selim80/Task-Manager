// app.js

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

// Error handling
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// Routers
const userRouter = require('./routes/userRoutes');
const taskRouter = require('./routes/taskRoutes');
const authRouter = require('./routes/authRoutes');

const app = express();

/*
  Trust proxy is useful when deploying behind services like Render, Railway, Heroku, etc.
  It helps Express correctly understand the original client IP for rate limiting.
*/
app.set('trust proxy', 1);

/*
  Security HTTP headers
  Helmet sets several important headers that make the API more secure.
*/
app.use(helmet());

/*
  CORS
  For now, allow all origins because this is an API project and you may test it from Postman,
  a frontend app, or documentation tools.

  Later, when you build a frontend, restrict origin to your frontend domain.
*/
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/*
  Development logging
*/
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/*
  Global rate limiter
  Limits repeated requests from the same IP.
*/
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP. Please try again in one hour.',
  },
});

app.use('/api', limiter);

/*
  Body parser
  Limits request body size to prevent very large payload attacks.
*/
app.use(express.json({ limit: '10kb' }));

/*
  Data sanitization against NoSQL query injection
  Removes MongoDB operators like $gt, $ne, $or from req.body, req.query, and req.params.
*/
app.use(mongoSanitize());

/*
  Prevent HTTP parameter pollution
  Example attack:
  /api/v1/tasks?status=todo&status=done

  Whitelist fields that you intentionally allow to appear multiple times.
*/
app.use(
  hpp({
    whitelist: [
      'status',
      'priority',
      'dueDate',
      'createdAt',
      'updatedAt',
    ],
  })
);

/*
  Compress response bodies for better performance.
*/
app.use(compression());

/*
  Root route
  Useful when someone opens the deployed Render URL directly.
*/
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Task Manager API is running',
    documentation: 'https://documenter.getpostman.com/view/48914644/2sBXqQHJwh',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      tasks: '/api/v1/tasks',
      health: '/health',
    },
  });
});

/*
  Health check route
  Useful for deployment checks and quick uptime testing.
*/
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

/*
  API routes
*/
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);

/*
  404 handler for unknown routes
  Express 5 supports this named wildcard syntax.
*/
app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

/*
  Global error handler
*/
app.use(globalErrorHandler);

module.exports = app;