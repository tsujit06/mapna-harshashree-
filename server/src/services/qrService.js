const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;
const QRCode = require('qrcode');
const QRTokenModel = require('../models/QRToken');
const { AppError } = require('../utils/AppError');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads', 'qrcodes');
const EMERGENCY_BASE = process.env.EMERGENCY_PAGE_BASE_URL || 'http://localhost:4000';

/**
 * Generate a cryptographically secure token (64 hex chars). Not guessable.
 */
function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Ensure upload directory exists.
 */
async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

/**
 * Build the URL that will be encoded in the QR. Only the token path — no PII.
 */
function getEmergencyUrl(token) {
  const base = EMERGENCY_BASE.replace(/\/$/, '');
  return `${base}/e/${token}`;
}

/**
 * Generate QR code for a user. Enforces ONE QR per user.
 * - If user already has a QR token, return existing (do not create duplicate).
 * - Otherwise: generate token, save to DB, generate PNG to uploads/qrcodes, return path and URL.
 *
 * Option A (recommended): Save PNG to /uploads/qrcodes/{token}.png
 * - Pros: Fast serving, CDN-friendly, no DB bloat, easy backup.
 * Option B: Store base64 in DB
 * - Cons: Larger DB, slower reads, harder to cache. Not recommended for production.
 * We use Option A.
 */
async function getOrCreateQRForUser(userId) {
  const existing = await QRTokenModel.findByUserId(userId);
  if (existing) {
    const url = getEmergencyUrl(existing.token);
    const filePath = path.join(UPLOAD_DIR, `${existing.token}.png`);
    let fileExists = false;
    try {
      await fs.access(filePath);
      fileExists = true;
    } catch {
      // Regenerate PNG if missing
      await ensureUploadDir();
      await QRCode.toFile(filePath, url, { width: 400, margin: 2 });
    }
    return {
      token: existing.token,
      url,
      qrImagePath: `${existing.token}.png`,
      isNew: false,
    };
  }

  const token = generateSecureToken();
  await QRTokenModel.create(userId, token);
  await ensureUploadDir();
  const filePath = path.join(UPLOAD_DIR, `${token}.png`);
  const url = getEmergencyUrl(token);
  await QRCode.toFile(filePath, url, { width: 400, margin: 2 });

  return {
    token,
    url,
    qrImagePath: `${token}.png`,
    isNew: true,
  };
}

/**
 * Get QR image path for download/serve. Returns path or null.
 */
function getQRImagePath(token) {
  return path.join(UPLOAD_DIR, `${token}.png`);
}

module.exports = {
  generateSecureToken,
  getEmergencyUrl,
  getOrCreateQRForUser,
  getQRImagePath,
  ensureUploadDir,
};
