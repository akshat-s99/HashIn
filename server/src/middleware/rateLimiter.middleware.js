import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 100, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests from this IP, please try again after 15 minutes',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 5, // limit each IP to 5 auth requests per windowMs
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many login attempts from this IP, please try again after 15 minutes',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
