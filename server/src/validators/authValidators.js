const { body } = require('express-validator');

const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 200 }).withMessage('Name too long'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('mobile').trim().notEmpty().withMessage('Mobile is required').isLength({ max: 20 }).withMessage('Mobile too long'),
];

const loginValidators = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = {
  registerValidators,
  loginValidators,
};
