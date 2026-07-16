import * as userService from '../services/user.service.js';
import { sendSuccess } from '../utils/apiResponse.utils.js';
import { HTTP_STATUS } from '../config/constants.js';
import { AppError } from '../utils/AppError.js';
import { deleteFromCloudinaryByUrl } from '../utils/cloudinaryUtils.js';

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

export const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    const users = await userService.searchUsers(q);
    sendSuccess(res, HTTP_STATUS.OK, { users });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('No image uploaded', 400));
    }
    const avatarUrl = req.file.path; // Cloudinary returns URL in path
    
    // Clean up old avatar if exists
    const currentUser = await userService.getUserProfile(req.user._id);
    if (currentUser && currentUser.avatar && currentUser.avatar.includes('cloudinary.com')) {
      await deleteFromCloudinaryByUrl(currentUser.avatar);
    }
    
    const updatedUser = await userService.updateUserProfile(req.user._id, { avatar: avatarUrl });
    sendSuccess(res, HTTP_STATUS.OK, { user: updatedUser }, 'Avatar updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    await userService.deleteUserAccount(req.user._id);
    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    sendSuccess(res, HTTP_STATUS.OK, null, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
};
