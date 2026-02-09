const fs = require('fs').promises;
const path = require('path');
const qrService = require('../services/qrService');
const QRToken = require('../models/QRToken');
const { AppError } = require('../utils/AppError');

/**
 * Get or create QR for current user. One user = one lifetime QR.
 * Returns URL and path to PNG.
 */
async function getOrCreate(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await qrService.getOrCreateQRForUser(userId);
    res.json({
      success: true,
      data: {
        url: result.url,
        qrImagePath: result.qrImagePath,
        isNew: result.isNew,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Download QR PNG. Token must belong to authenticated user.
 */
async function download(req, res, next) {
  try {
    const userId = req.user.id;
    const { token } = req.params;
    const row = await QRToken.findByToken(token);
    if (!row || row.user_id !== userId) {
      throw new AppError('QR not found', 404);
    }
    const filePath = qrService.getQRImagePath(token);
    try {
      await fs.access(filePath);
    } catch {
      await qrService.ensureUploadDir();
      const QRCode = require('qrcode');
      await QRCode.toFile(filePath, qrService.getEmergencyUrl(token), { width: 400, margin: 2 });
    }
    res.sendFile(path.resolve(filePath), { headers: { 'Content-Type': 'image/png' } }, (err) => {
      if (err) next(err);
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOrCreate,
  download,
};
