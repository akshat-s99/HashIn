import { registerUser, loginUser, refreshUserToken, logoutUser, logoutAllSessions, forgotPassword as forgotPasswordService, resetPassword as resetPasswordService } from '../services/auth.service.js';
import { sendSuccess } from '../utils/apiResponse.utils.js';
import { HTTP_STATUS } from '../config/constants.js';

// Cookie options for the refresh token
const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

export const register = async (req, res, next) => {
  try {
    const userAgent = req.headers['user-agent'];
    const { user, accessToken, refreshToken } = await registerUser(req.body, userAgent);

    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    sendSuccess(res, HTTP_STATUS.CREATED, { user, accessToken }, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent'];
    const { user, accessToken, refreshToken } = await loginUser(email, password, userAgent);

    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

    sendSuccess(res, HTTP_STATUS.OK, { user, accessToken }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;
    const userAgent = req.headers['user-agent'];
    const { newAccessToken, newRefreshToken, user } = await refreshUserToken(oldRefreshToken, userAgent);

    // Rotate: set a new refresh token cookie
    res.cookie('refreshToken', newRefreshToken, getRefreshCookieOptions());

    sendSuccess(res, HTTP_STATUS.OK, { accessToken: newAccessToken, user }, 'Token refreshed successfully');
  } catch (error) {
    // On any refresh failure, clear the cookie
    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await logoutUser(refreshToken);
    }

    res.clearCookie('refreshToken', { path: '/api/v1/auth' });

    sendSuccess(res, HTTP_STATUS.OK, null, 'Logged out successfully');
  } catch (error) {
    res.clearCookie('refreshToken', { path: '/api/v1/auth' });
    next(error);
  }
};

export const logoutAll = async (req, res, next) => {
  try {
    // This requires the user to be authenticated via the protect middleware
    await logoutAllSessions(req.user.id);

    res.clearCookie('refreshToken', { path: '/api/v1/auth' });

    sendSuccess(res, HTTP_STATUS.OK, null, 'Logged out from all sessions successfully');
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new AppError('Please provide an email', HTTP_STATUS.BAD_REQUEST));
    }

    await forgotPasswordService(email);
    sendSuccess(res, HTTP_STATUS.OK, null, 'Password reset token sent to email');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return next(new AppError('Please provide a new password', HTTP_STATUS.BAD_REQUEST));
    }

    await resetPasswordService(req.params.resetToken, password);

    // If there is an existing refresh token, clear it as all sessions were logged out
    res.clearCookie('refreshToken', { path: '/api/v1/auth' });

    sendSuccess(res, HTTP_STATUS.OK, null, 'Password reset successfully');
  } catch (error) {
    next(error);
  }
};
