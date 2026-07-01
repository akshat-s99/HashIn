import { HTTP_STATUS } from '../config/constants.js';
import { env } from '../config/env.js';
import { sendError } from '../utils/apiResponse.utils.js';

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  if (env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Production error formatting
  if (err.isOperational) {
    return sendError(res, err.statusCode, err.message);
  }

  // Programming or other unknown error: don't leak error details
  console.error('ERROR 💥', err);
  return sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Something went very wrong!');
};
