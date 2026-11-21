import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import validate from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';
import controller from '../controllers/auth.controller.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/auth.validator.js';

const router = Router();

/**
 * Stricter limiter on the credential endpoints — this is where brute force
 * and credential stuffing actually happen.
 */
const credentialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: { message: 'Too many attempts. Please try again in a few minutes.' },
  },
});

router.post('/register', credentialLimiter, validate(registerSchema), controller.register);
router.post('/login', credentialLimiter, validate(loginSchema), controller.login);
router.post('/logout', asyncHandler(controller.logout));
router.get('/me', requireAuth, asyncHandler(controller.me));
router.patch('/profile', requireAuth, validate(updateProfileSchema), asyncHandler(controller.updateProfile));
router.post(
  '/change-password',
  requireAuth,
  credentialLimiter,
  validate(changePasswordSchema),
  asyncHandler(controller.changePassword),
);
router.post('/forgot-password', credentialLimiter, validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password', credentialLimiter, validate(resetPasswordSchema), controller.resetPassword);

export default router;
