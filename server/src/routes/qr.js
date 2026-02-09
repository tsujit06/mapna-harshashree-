const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', qrController.getOrCreate);
router.get('/download/:token', qrController.download);

module.exports = router;
