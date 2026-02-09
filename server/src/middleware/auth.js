const authService = require('../services/authService');
const User = require('../models/User');
const { AppError } = require('../utils/AppError');

/**
 * Extract Bearer token from Authorization header and attach req.user (without password).
 */
async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new AppError('Authorization token required', 401);
    }
    const token = auth.slice(7).trim();
    const payload = authService.verifyToken(token);
    if (!payload || !payload.sub) {
      throw new AppError('Invalid or expired token', 401);
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      throw new AppError('User not found', 401);
    }
    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Optional auth: if Bearer present, set req.user; otherwise continue without.
 */
async function optionalAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return next();
    }
    const token = auth.slice(7).trim();
    const payload = authService.verifyToken(token);
    if (!payload?.sub) return next();
    const user = await User.findById(payload.sub);
    if (user) req.user = user;
    next();
  } catch {
    next();
  }
}

/**
 * Require req.user.role === 'admin'. Use after authenticate (for user-based admin).
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }
  next();
}

/**
 * Verify JWT and require role === 'admin'. Sets req.admin = { id }. Use for admin-only routes.
 * Works for both admins table and users with role=admin.
 */
async function authenticateAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new AppError('Authorization required', 401);
    }
    const token = auth.slice(7).trim();
    const payload = authService.verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      throw new AppError('Admin access required', 403);
    }
    req.admin = { id: payload.sub };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  authenticate,
  optionalAuth,
  requireAdmin,
  authenticateAdmin,
};
