const { validationResult } = require('express-validator');
const { AppError } = require('../utils/AppError');

/**
 * Run express-validator and throw AppError(400) if there are errors.
 * Use after validators in route.
 */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join('; ');
    return next(new AppError(message, 400));
  }
  next();
}

module.exports = { handleValidation };
