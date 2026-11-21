import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import DEFAULT_CATEGORIES from '../utils/defaultCategories.js';
import { sendPasswordResetEmail } from './email.service.js';

/** Signs a JWT for the given user. */
function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

/** Cookie options shared by sign-in and sign-out. */
export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: env.isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  };
}

export function setAuthCookie(res, token) {
  res.cookie(env.cookieName, token, authCookieOptions());
}

export function clearAuthCookie(res) {
  res.clearCookie(env.cookieName, { ...authCookieOptions(), maxAge: undefined });
}

/** Seeds the default income/expense categories for a brand new user. */
async function seedDefaultCategories(userId) {
  const documents = DEFAULT_CATEGORIES.map((category) => ({
    ...category,
    userId,
    isDefault: true,
  }));
  await Category.insertMany(documents, { ordered: false });
}

export async function register({ name, email, password }) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw ApiError.conflict('An account with that email already exists');
  }

  const user = await User.create({ name, email: email.toLowerCase(), password });
  await seedDefaultCategories(user._id);

  return { user: user.toPublicJSON(), token: signToken(user) };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  // The same message is used for an unknown email and a wrong password so
  // the endpoint cannot be used to enumerate registered accounts.
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const matches = await user.comparePassword(password);
  if (!matches) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  return { user: user.toPublicJSON(), token: signToken(user) };
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.unauthorized('Account no longer exists');
  return user.toPublicJSON();
}

/** Updates the profile fields the user is allowed to change. */
export async function updateProfile(userId, { name }) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('Account not found');
  if (name !== undefined) user.name = name;
  await user.save();
  return user.toPublicJSON();
}

/**
 * Changes the password after verifying the current one.
 * The session cookie is cleared so other devices must sign in again.
 */
export async function changePassword(userId, { currentPassword, password }) {
  const user = await User.findById(userId).select('+password');
  if (!user) throw ApiError.notFound('Account not found');

  const matches = await user.comparePassword(currentPassword);
  if (!matches) {
    throw ApiError.badRequest('Your current password is incorrect');
  }

  user.password = password;
  await user.save();
  return { message: 'Password updated. Please sign in again.' };
}

/**
 * Starts the password reset flow.
 *
 * The response is intentionally vague about whether the account exists, but
 * it does report honestly whether an email could actually be sent.
 */
export async function requestPasswordReset({ email, clientOrigin }) {
  const user = await User.findOne({ email: email.toLowerCase() });
  const genericMessage =
    'If an account exists for that email, a password reset link has been sent.';

  if (!user) {
    return { message: genericMessage, emailSent: false, resetToken: undefined };
  }

  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  user.resetPasswordToken = tokenHash;
  user.resetPasswordExpires = new Date(Date.now() + env.resetTokenTtlMinutes * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${clientOrigin}/reset-password?token=${rawToken}`;
  const result = await sendPasswordResetEmail({
    to: user.email,
    name: user.name,
    resetUrl,
  });

  if (!result.sent) {
    console.warn(`[spendwise] Password reset email not sent: ${result.reason}`);
  }

  // Outside production the raw token is returned so the flow can be tested
  // without an SMTP account. It is never exposed in production.
  const resetToken = env.isProduction ? undefined : rawToken;

  return { message: genericMessage, emailSent: result.sent, resetToken };
}

export async function resetPassword({ token, password }) {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  }).select('+password +resetPasswordToken +resetPasswordExpires');

  if (!user) {
    throw ApiError.badRequest('This reset link is invalid or has expired');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { user: user.toPublicJSON() };
}
