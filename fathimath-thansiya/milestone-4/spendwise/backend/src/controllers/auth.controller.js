import asyncHandler from '../utils/asyncHandler.js';
import { sendCreated, sendMessage, sendSuccess } from '../utils/apiResponse.js';
import env from '../config/env.js';
import {
  register as registerService,
  login as loginService,
  getCurrentUser,
  updateProfile as updateProfileService,
  changePassword as changePasswordService,
  requestPasswordReset,
  resetPassword as resetPasswordService,
  setAuthCookie,
  clearAuthCookie,
} from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await registerService(req.body);
  setAuthCookie(res, token);
  sendCreated(res, { user });
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await loginService(req.body);
  setAuthCookie(res, token);
  sendSuccess(res, { user });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  sendMessage(res, 'Signed out successfully');
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.userId);
  sendSuccess(res, { user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const clientOrigin = req.get('origin') || env.frontendUrl;
  const result = await requestPasswordReset({ ...req.body, clientOrigin });
  sendSuccess(res, result);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { user } = await resetPasswordService(req.body);
  sendSuccess(res, { user, message: 'Password updated. You can sign in now.' });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await updateProfileService(req.userId, req.body);
  sendSuccess(res, { user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const result = await changePasswordService(req.userId, req.body);
  clearAuthCookie(res);
  sendSuccess(res, result);
});

export default {
  register,
  login,
  logout,
  me,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
};
