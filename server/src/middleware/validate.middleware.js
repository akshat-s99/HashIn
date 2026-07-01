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
    const errors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Validation failed', errors);
  }
};
