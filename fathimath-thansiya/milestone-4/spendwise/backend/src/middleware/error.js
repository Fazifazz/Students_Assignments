import env from '../config/env.js';

/** 404 handler — unmatched routes return the standard error envelope. */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { message: `Route ${req.method} ${req.originalUrl} not found` },
  });
}

/**
 * Centralised error handler.
 * Only safe, generic messages leave the server; details stay in the log.
 */
export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  let status = error.status || 500;
  let message = error.message || 'Internal server error';
  let details = error.details;

  if (error.name === 'ZodError') {
    status = 400;
    message = 'Validation failed';
    details = error.issues?.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
  }

  if (error.name === 'ValidationError' && error.errors) {
    status = 400;
    message = 'Validation failed';
    details = Object.values(error.errors).map((err) => ({ field: err.path, message: err.message }));
  }

  if (error.code === 11000) {
    status = 409;
    message = 'A record with those values already exists';
  }

  if (status >= 500) {
    console.error('[spendwise] Unhandled error:', error);
    if (env.isProduction) message = 'Something went wrong on our side';
  }

  res.status(status).json({
    success: false,
    error: { message, ...(details ? { details } : {}) },
  });
}
