const { body, param } = require('express-validator');

const adminLoginValidators = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const userIdParamValidator = [
  param('userId').isUUID().withMessage('Invalid user ID'),
];

module.exports = {
  adminLoginValidators,
  userIdParamValidator,
};
