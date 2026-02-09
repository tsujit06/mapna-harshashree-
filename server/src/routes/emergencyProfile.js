const express = require('express');
const router = express.Router();
const emergencyProfileController = require('../controllers/emergencyProfileController');
const { emergencyProfileValidators } = require('../validators/emergencyProfileValidators');
const { handleValidation } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', emergencyProfileValidators, handleValidation, emergencyProfileController.upsert);
router.get('/me', emergencyProfileController.getMine);

module.exports = router;
