const { AppError } = require('../utils/AppError');

/**
 * Centralized error middleware. Must be registered last.
 * - AppError → statusCode and message
 * - JWT errors → 401
 * - PG unique violation → 409
 * - Else → 500, hide message in production
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token';
  } else if (err.code === '23505') {
    statusCode = 409;
    message = 'Resource already exists (duplicate)';
  } else if (err.code === '23503') {
    statusCode = 400;
    message = 'Invalid reference';
  } else if (err.message) {
    message = err.message;
  }

  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error';
    console.error(err);
  } else if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && err.stack && { stack: err.stack }),
  });
}

module.exports = { errorHandler };
