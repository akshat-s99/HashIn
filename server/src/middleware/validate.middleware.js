import { HTTP_STATUS } from '../config/constants.js';
import { sendError } from '../utils/apiResponse.utils.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    const zodErrors = err.issues || err.errors || [];
    const errors = zodErrors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    const message = zodErrors.map((e) => e.message).join(', ') || 'Validation failed';
    return sendError(res, HTTP_STATUS.BAD_REQUEST, message, errors);
  }
};
