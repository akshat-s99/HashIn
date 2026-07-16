import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { sendSuccess } from './utils/apiResponse.utils.js';
import { HTTP_STATUS } from './config/constants.js';
import { AppError } from './utils/AppError.js';

const app = express();

// Middleware Stack
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use('/api', apiLimiter);
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());


// Custom wrapper for express-mongo-sanitize to support Express 5
// Express 5 makes req.query a getter-only property, so we can't reassign it.
// Since sanitize mutates the object in place, we just call it directly.
const sanitizeMiddleware = (options = {}) => (req, res, next) => {
  ['body', 'params', 'headers', 'query'].forEach((key) => {
    if (req[key]) mongoSanitize.sanitize(req[key], options);
  });
  next();
};

app.use(sanitizeMiddleware()); // Prevent NoSQL injection


import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import connectionRoutes from './routes/connection.routes.js';
import discoverRoutes from './routes/discover.routes.js';
import messageRoutes from './routes/message.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Health Check Route
app.get('/api/health', (req, res) => {
  sendSuccess(res, HTTP_STATUS.OK, null, 'HashIn API is running');
});

// Main Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/connections', connectionRoutes);
app.use('/api/v1/discover', discoverRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);

// Unhandled Routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, HTTP_STATUS.NOT_FOUND));
});

// Global Error Handler
app.use(errorHandler);

export default app;
