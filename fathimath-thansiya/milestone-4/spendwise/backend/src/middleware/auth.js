import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

/**
 * Verifies the JWT from the HTTP-only auth cookie and attaches the user to
 * `req.user`.
 *
 * The token is the only source of identity — the request body never carries
 * a userId, so users cannot act on someone else's data.
 */
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[env.cookieName];
    if (!token) {
      throw ApiError.unauthorized('Authentication required');
    }

    let payload;
    try {
      payload = jwt.verify(token, env.jwtSecret);
    } catch (error) {
      throw ApiError.unauthorized(
        error.name === 'TokenExpiredError' ? 'Session expired, please sign in again' : 'Invalid session',
      );
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw ApiError.unauthorized('Session is no longer valid');
    }

    req.user = user;
    req.userId = user._id;
    return next();
  } catch (error) {
    return next(error);
  }
}

/** Attaches `req.user` when a valid session exists, but never blocks. */
export async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.[env.cookieName];
    if (token) {
      const payload = jwt.verify(token, env.jwtSecret);
      const user = await User.findById(payload.sub);
      if (user) {
        req.user = user;
        req.userId = user._id;
      }
    }
  } catch {
    // An invalid token is simply treated as "not signed in" here.
  }
  return next();
}

export default requireAuth;
