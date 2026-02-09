const bcrypt = require('bcrypt');
const User = require('../models/User');
const Admin = require('../models/Admin');
const authService = require('../services/authService');
const { AppError } = require('../utils/AppError');

/**
 * Admin login: use admins table (or user with role=admin). Return JWT.
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findByEmail(email?.trim()?.toLowerCase());
    if (admin) {
      const ok = await bcrypt.compare(password, admin.password_hash);
      if (!ok) throw new AppError('Invalid credentials', 401);
      const token = authService.signToken({ sub: admin.id, role: 'admin' });
      return res.json({
        success: true,
        data: { token, user: { id: admin.id, email: admin.email, role: 'admin' } },
      });
    }
    const user = await User.findByEmail(email?.trim()?.toLowerCase());
    if (user && user.role === 'admin') {
      const userWithPass = await User.findByIdWithPassword(user.id);
      const ok = await bcrypt.compare(password, userWithPass.password_hash);
      if (!ok) throw new AppError('Invalid credentials', 401);
      const token = authService.signToken({ sub: user.id, role: 'admin' });
      return res.json({
        success: true,
        data: { token, user: { id: user.id, email: user.email, role: 'admin' } },
      });
    }
    throw new AppError('Invalid credentials', 401);
  } catch (err) {
    next(err);
  }
}

/**
 * List users (id, name, email, mobile, createdAt). Pagination optional.
 */
async function listUsers(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const offset = parseInt(req.query.offset, 10) || 0;
    const db = require('../config/db');
    const countRes = await db.query('SELECT COUNT(*)::int AS total FROM users WHERE role = $1', ['user']);
    const usersRes = await db.query(
      `SELECT id, name, email, mobile, created_at
       FROM users WHERE role = 'user'
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    res.json({
      success: true,
      data: {
        users: usersRes.rows,
        total: countRes.rows[0].total,
        limit,
        offset,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Disable QR for a user (by user id or by token).
 */
async function disableQR(req, res, next) {
  try {
    const { userId } = req.params;
    const db = require('../config/db');
    const r = await db.query('UPDATE qr_tokens SET is_active = FALSE WHERE user_id = $1 RETURNING id', [userId]);
    if (r.rows.length === 0) {
      throw new AppError('User has no QR or user not found', 404);
    }
    res.json({
      success: true,
      data: { message: 'QR disabled', userId },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Enable QR for a user.
 */
async function enableQR(req, res, next) {
  try {
    const { userId } = req.params;
    const db = require('../config/db');
    const r = await db.query('UPDATE qr_tokens SET is_active = TRUE WHERE user_id = $1 RETURNING id', [userId]);
    if (r.rows.length === 0) {
      throw new AppError('User has no QR or user not found', 404);
    }
    res.json({
      success: true,
      data: { message: 'QR enabled', userId },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  listUsers,
  disableQR,
  enableQR,
};
