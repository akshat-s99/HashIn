import { User } from '../models/User.model.js';
import { sendSuccess } from '../utils/apiResponse.utils.js';
import { HTTP_STATUS } from '../config/constants.js';
import { AppError } from '../utils/AppError.js';
import { logoutAllSessions } from '../services/auth.service.js';

export const disableUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', HTTP_STATUS.NOT_FOUND));
    }

    user.isDisabled = true;
    await user.save({ validateModifiedOnly: true });

    // Log the user out from all active sessions
    await logoutAllSessions(user._id);

    sendSuccess(res, HTTP_STATUS.OK, { user }, 'User account disabled');
  } catch (error) {
    next(error);
  }
};

export const enableUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(new AppError('User not found', HTTP_STATUS.NOT_FOUND));
    }

    user.isDisabled = false;
    await user.save({ validateModifiedOnly: true });

    sendSuccess(res, HTTP_STATUS.OK, { user }, 'User account enabled');
  } catch (error) {
    next(error);
  }
};
