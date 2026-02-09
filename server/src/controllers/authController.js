const authService = require('../services/authService');
const { handleValidation } = require('../middleware/validate');

async function register(req, res, next) {
  try {
    const { name, email, password, mobile } = req.body;
    const result = await authService.register({ name, email, password, mobile });
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};
