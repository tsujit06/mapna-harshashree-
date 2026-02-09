const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidators, loginValidators } = require('../validators/authValidators');
const { handleValidation } = require('../middleware/validate');

router.post('/register', registerValidators, handleValidation, authController.register);
router.post('/login', loginValidators, handleValidation, authController.login);

module.exports = router;
