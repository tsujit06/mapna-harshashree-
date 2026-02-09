const EmergencyProfile = require('../models/EmergencyProfile');
const qrService = require('../services/qrService');
const { AppError } = require('../utils/AppError');

/**
 * Create or update emergency profile for the authenticated user.
 * After upsert, ensure user has a QR (one per user). Return profile + QR info.
 */
async function upsert(req, res, next) {
  try {
    const userId = req.user.id;
    const profile = await EmergencyProfile.upsert(userId, req.body);
    const qr = await qrService.getOrCreateQRForUser(userId);
    res.json({
      success: true,
      data: {
        profile: {
          id: profile.id,
          bloodGroup: profile.blood_group,
          allergies: profile.allergies,
          medicalConditions: profile.medical_conditions,
          medications: profile.medications,
          guardianPhone: profile.guardian_phone,
          secondaryPhone: profile.secondary_phone,
          emergencyNote: profile.emergency_note,
          age: profile.age,
          language: profile.language,
          organDonor: profile.organ_donor,
        },
        qr: {
          url: qr.url,
          qrImagePath: qr.qrImagePath,
          isNew: qr.isNew,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get current user's emergency profile (and QR if any).
 */
async function getMine(req, res, next) {
  try {
    const userId = req.user.id;
    const profile = await EmergencyProfile.findByUserId(userId);
    const qr = await qrService.getOrCreateQRForUser(userId);
    res.json({
      success: true,
      data: {
        profile: profile
          ? {
              id: profile.id,
              bloodGroup: profile.blood_group,
              allergies: profile.allergies,
              medicalConditions: profile.medical_conditions,
              medications: profile.medications,
              guardianPhone: profile.guardian_phone,
              secondaryPhone: profile.secondary_phone,
              emergencyNote: profile.emergency_note,
              age: profile.age,
              language: profile.language,
              organDonor: profile.organ_donor,
            }
          : null,
        qr: {
          url: qr.url,
          qrImagePath: qr.qrImagePath,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  upsert,
  getMine,
};
