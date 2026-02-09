const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/e/:token', publicController.getEmergencyByToken);

module.exports = router;
