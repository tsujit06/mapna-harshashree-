const db = require('../config/db');
const QRToken = require('../models/QRToken');
const EmergencyProfile = require('../models/EmergencyProfile');

/**
 * GET /e/:token — Public emergency page data.
 * - Token must exist and be active.
 * - Return ONLY emergency-safe fields (name, blood group, contacts, medical summary).
 * - NEVER expose: email, password, internal IDs (except for display name).
 * - If QR disabled: return 200 with message "QR is inactive. Contact the owner."
 */
async function getEmergencyByToken(req, res, next) {
  try {
    const { token } = req.params;
    const row = await QRToken.findByToken(token);
    if (!row) {
      return res.status(404).json({
        success: false,
        error: 'Invalid or expired link',
      });
    }
    if (!row.is_active) {
      return res.json({
        success: true,
        inactive: true,
        message: 'QR is inactive. Contact the owner.',
        data: null,
      });
    }

    const profile = await EmergencyProfile.findByToken(token);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Emergency profile not found',
      });
    }

    // Optional: log scan for analytics (no PII from scanner)
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    db.query(
      'INSERT INTO scan_logs (token, ip, user_agent) VALUES ($1, $2, $3)',
      [token, ip.substring(0, 100), userAgent.substring(0, 500)]
    ).catch(() => {});

    res.json({
      success: true,
      data: {
        name: profile.user_name,
        age: profile.age,
        language: profile.language,
        bloodGroup: profile.blood_group,
        allergies: profile.allergies,
        medicalConditions: profile.medical_conditions,
        medications: profile.medications,
        emergencyNote: profile.emergency_note,
        guardianPhone: profile.guardian_phone,
        secondaryPhone: profile.secondary_phone,
        organDonor: profile.organ_donor,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEmergencyByToken,
};
