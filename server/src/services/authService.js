const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/AppError');

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function comparePassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Register: hash password, create user, return JWT (no payment).
 */
async function register({ name, email, password, mobile }) {
  const existing = await User.findByEmail(email);
  if (existing) {
    throw new AppError('Email already registered', 409);
  }
  const passwordHash = await hashPassword(password);
  const user = await User.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    mobile: mobile.trim(),
    role: 'user',
  });
  const token = signToken({ sub: user.id, role: user.role });
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
    token,
    expiresIn: JWT_EXPIRES_IN,
  };
}

/**
 * Login: verify password, return JWT.
 */
async function login(email, password) {
  const user = await User.findByEmail(email.trim().toLowerCase());
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }
  const ok = await comparePassword(password, user.password_hash);
  if (!ok) {
    throw new AppError('Invalid email or password', 401);
  }
  const token = signToken({ sub: user.id, role: user.role });
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
    token,
    expiresIn: JWT_EXPIRES_IN,
  };
}

module.exports = {
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
  register,
  login,
};
