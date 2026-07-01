import * as userService from '../services/user.service.js';
import { sendSuccess } from '../utils/apiResponse.utils.js';
import { HTTP_STATUS } from '../config/constants.js';

export const getMe = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user._id);
    sendSuccess(res, HTTP_STATUS.OK, { user });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user._id, req.body);
    sendSuccess(res, HTTP_STATUS.OK, { user: updatedUser }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await userService.getPublicProfile(req.params.userId);
    sendSuccess(res, HTTP_STATUS.OK, { user });
  } catch (error) {
    next(error);
  }
};
