import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { sendSuccess } from './utils/apiResponse.utils.js';
import { HTTP_STATUS } from './config/constants.js';

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

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import discoverRoutes from './routes/discover.routes.js';
import postRoutes from './routes/post.routes.js';
import connectionRoutes from './routes/connection.routes.js';

// Health Check Route
app.get('/api/health', (req, res) => {
  sendSuccess(res, HTTP_STATUS.OK, null, 'HashIn API is running');
});

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/connections', connectionRoutes);

// Unhandled Routes
app.all('*', (req, res, next) => {
  next(new Error(`Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(errorHandler);

export default app;
