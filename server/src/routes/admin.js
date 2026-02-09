const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');
const { adminLoginValidators, userIdParamValidator } = require('../validators/adminValidators');
const { handleValidation } = require('../middleware/validate');

router.post('/login', adminLoginValidators, handleValidation, adminController.login);

router.use(authenticateAdmin);
router.get('/users', adminController.listUsers);
router.post('/users/:userId/disable-qr', userIdParamValidator, handleValidation, adminController.disableQR);
router.post('/users/:userId/enable-qr', userIdParamValidator, handleValidation, adminController.enableQR);

module.exports = router;
