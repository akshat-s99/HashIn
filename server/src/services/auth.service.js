import crypto from 'crypto';
import { User } from '../models/User.model.js';
import { AppError } from '../utils/AppError.js';
import { HTTP_STATUS } from '../config/constants.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js';
import { sendEmail } from '../utils/email.js';
import { env } from '../config/env.js';

export const registerUser = async (userData, userAgent) => {
  const { email } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  // Whitelist allowed fields — prevents mass-assignment of role, isDisabled, etc.
  const { firstName, lastName, password } = userData;
  const user = await User.create({ firstName, lastName, email, password });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store the refresh token as a new session
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    userAgent
  });
  await user.save({ validateModifiedOnly: true });

  // Return user without password/refreshToken
  const userResponse = await User.findById(user._id);

  return { user: userResponse, accessToken, refreshToken };
};

export const loginUser = async (email, password, userAgent) => {
  const user = await User.findOne({ email }).select('+password +refreshTokens');

  if (!user || !(await user.matchPassword(password))) {
    throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
  }

  if (user.isDisabled) {
    throw new AppError('Your account has been disabled. Contact support.', HTTP_STATUS.FORBIDDEN);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Clean up expired tokens to prevent array growth
  user.refreshTokens = user.refreshTokens.filter(t => t.expiresAt > new Date());

  // Add the new session
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    userAgent
  });
  await user.save({ validateModifiedOnly: true });

  // Return user without password/refreshToken
  const userResponse = await User.findById(user._id);

  return { user: userResponse, accessToken, refreshToken };
};

export const refreshUserToken = async (oldToken, userAgent) => {
  if (!oldToken) {
    throw new AppError('No refresh token provided', HTTP_STATUS.UNAUTHORIZED);
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(oldToken);
  } catch (error) {
    throw new AppError('Invalid refresh token, please login again', HTTP_STATUS.UNAUTHORIZED);
  }

  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user) {
    throw new AppError('User no longer exists', HTTP_STATUS.UNAUTHORIZED);
  }

  // Check if the presented token matches any stored session
  const sessionIndex = user.refreshTokens.findIndex(t => t.token === oldToken);

  if (sessionIndex === -1) {
    // Possible token theft — the presented token is valid (signed) but NOT in the DB.
    // This implies it was already used/rotated. Invalidate ALL sessions.
    user.refreshTokens = [];
    await user.save({ validateModifiedOnly: true });
    throw new AppError('Refresh token reuse detected. All sessions invalidated. Please login again.', HTTP_STATUS.UNAUTHORIZED);
  }

  // Rotate: issue new tokens
  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  // Replace the old session with the new one
  user.refreshTokens[sessionIndex] = {
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    userAgent
  };
  
  await user.save({ validateModifiedOnly: true });

  const userResponse = await User.findById(user._id);

  return { newAccessToken, newRefreshToken, user: userResponse };
};

export const logoutUser = async (token) => {
  if (!token) return;

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select('+refreshTokens');
    if (user) {
      // Remove only this specific session
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== token);
      await user.save({ validateModifiedOnly: true });
    }
  } catch {
    // Token is invalid/expired — nothing to clean up server-side
  }
};

export const logoutAllSessions = async (userId) => {
  const user = await User.findById(userId).select('+refreshTokens');
  if (user) {
    user.refreshTokens = [];
    await user.save({ validateModifiedOnly: true });
  }
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('There is no user with that email address.', HTTP_STATUS.NOT_FOUND);
  }

  // Generate token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save({ validateModifiedOnly: true });

  // Create reset url
  const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please go to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateModifiedOnly: true });
    throw new AppError('Email could not be sent', 500);
  }
};

export const resetPassword = async (resetToken, newPassword) => {
  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  }).select('+password');

  if (!user) {
    throw new AppError('Invalid or expired token', HTTP_STATUS.BAD_REQUEST);
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save(); // Password will be hashed by pre-save hook

  // Invalidate all active sessions for security
  await logoutAllSessions(user._id);
};
