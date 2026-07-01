import { User } from '../models/User.model.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../config/constants.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js';

export const registerUser = async (userData) => {
  const { email } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already registered', HTTP_STATUS.BAD_REQUEST);
  }

  const user = await User.create(userData);

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Return user without password
  const userResponse = await User.findById(user._id);

  return { user: userResponse, accessToken, refreshToken };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  
  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Return user without password
  const userResponse = await User.findById(user._id);

  return { user: userResponse, accessToken, refreshToken };
};

export const refreshUserToken = async (token) => {
  if (!token) {
    throw new AppError('No refresh token provided', HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    const decoded = verifyRefreshToken(token);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User no longer exists', HTTP_STATUS.UNAUTHORIZED);
    }

    const newAccessToken = generateAccessToken(user._id);
    return { newAccessToken };
  } catch (error) {
    throw new AppError('Invalid refresh token, please login again', HTTP_STATUS.UNAUTHORIZED);
  }
};
