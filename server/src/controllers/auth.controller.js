import { registerUser, loginUser, refreshUserToken } from '../services/auth.service.js';
import { sendSuccess } from '../utils/apiResponse.utils.js';
import { HTTP_STATUS } from '../config/constants.js';

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

const refreshCookieOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const accessCookieOptions = {
  ...cookieOptions,
  maxAge: 15 * 60 * 1000, // 15 minutes
};

export const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await registerUser(req.body);

    res.cookie('jwt', accessToken, accessCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    sendSuccess(res, HTTP_STATUS.CREATED, { user }, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(email, password);

    res.cookie('jwt', accessToken, accessCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    sendSuccess(res, HTTP_STATUS.OK, { user }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const { newAccessToken } = await refreshUserToken(refreshToken);

    res.cookie('jwt', newAccessToken, accessCookieOptions);

    sendSuccess(res, HTTP_STATUS.OK, null, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    ...cookieOptions,
    maxAge: 1, // Expire immediately
  });
  res.cookie('refreshToken', 'loggedout', {
    ...cookieOptions,
    maxAge: 1, // Expire immediately
  });

  sendSuccess(res, HTTP_STATUS.OK, null, 'Logged out successfully');
};
