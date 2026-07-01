export const sendSuccess = (res, statusCode, data, message = 'Success') => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

export const sendError = (res, statusCode, message, errors = null) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors }),
  });
};
