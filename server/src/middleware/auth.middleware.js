import { AppError } from '../utils/AppError.js';
import { verifyAccessToken } from '../utils/jwt.utils.js';
import { User } from '../models/User.model.js';
import { HTTP_STATUS } from '../config/constants.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError(
          'You are not logged in. Please log in to get access.',
          HTTP_STATUS.UNAUTHORIZED
        )
      );
    }

    const decoded = verifyAccessToken(token);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          HTTP_STATUS.UNAUTHORIZED
        )
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(
      new AppError('Invalid token. Please log in again.', HTTP_STATUS.UNAUTHORIZED)
    );
  }
};
