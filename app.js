// app.js

const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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

app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: {
    status: 'fail',
    message: 'Too many requests from this IP. Please try again in one hour.',
  },
});

app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));


const sanitizeNoSQL = (obj) => {
  if (!obj || typeof obj !== 'object') return;

  Object.keys(obj).forEach((key) => {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      return;
    }

    if (typeof obj[key] === 'object') {
      sanitizeNoSQL(obj[key]);
    }
  });
};

app.use((req, res, next) => {
  sanitizeNoSQL(req.body);
  sanitizeNoSQL(req.params);
  next();
});

// Compress responses
app.use(compression());

// Root route
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

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);

// 404 handler for unknown routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;