const db = require('../config/db');

/**
 * Emergency profile: one per user. Created/updated when user submits emergency profile.
 * Used by GET /e/:token to show safe emergency info only.
 */

async function upsert(userId, data) {
  const {
    bloodGroup,
    allergies,
    medicalConditions,
    medications,
    guardianPhone,
    secondaryPhone,
    emergencyNote,
    age,
    language,
    organDonor = false,
  } = data;

  const res = await db.query(
    `INSERT INTO emergency_profiles (
      user_id, blood_group, allergies, medical_conditions, medications,
      guardian_phone, secondary_phone, emergency_note, age, language, organ_donor
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (user_id) DO UPDATE SET
      blood_group = EXCLUDED.blood_group,
      allergies = EXCLUDED.allergies,
      medical_conditions = EXCLUDED.medical_conditions,
      medications = EXCLUDED.medications,
      guardian_phone = EXCLUDED.guardian_phone,
      secondary_phone = EXCLUDED.secondary_phone,
      emergency_note = EXCLUDED.emergency_note,
      age = EXCLUDED.age,
      language = EXCLUDED.language,
      organ_donor = EXCLUDED.organ_donor,
      updated_at = NOW()
    RETURNING id, user_id, blood_group, allergies, medical_conditions, medications,
              guardian_phone, secondary_phone, emergency_note, age, language, organ_donor, created_at`,
    [
      userId,
      bloodGroup || null,
      allergies || null,
      medicalConditions || null,
      medications || null,
      guardianPhone || null,
      secondaryPhone || null,
      emergencyNote || null,
      age != null ? parseInt(age, 10) : null,
      language || null,
      !!organDonor,
    ]
  );
  return res.rows[0];
}

async function findByUserId(userId) {
  const res = await db.query(
    `SELECT id, user_id, blood_group, allergies, medical_conditions, medications,
            guardian_phone, secondary_phone, emergency_note, age, language, organ_donor, created_at
     FROM emergency_profiles WHERE user_id = $1`,
    [userId]
  );
  return res.rows[0] || null;
}

/**
 * Get emergency profile by token (join via qr_tokens). Used for public /e/:token.
 */
async function findByToken(token) {
  const res = await db.query(
    `SELECT ep.blood_group, ep.allergies, ep.medical_conditions, ep.medications,
            ep.guardian_phone, ep.secondary_phone, ep.emergency_note, ep.age, ep.language, ep.organ_donor,
            u.name AS user_name
     FROM qr_tokens qt
     JOIN users u ON u.id = qt.user_id
     JOIN emergency_profiles ep ON ep.user_id = qt.user_id
     WHERE qt.token = $1 AND qt.is_active = TRUE`,
    [token]
  );
  return res.rows[0] || null;
}

module.exports = {
  upsert,
  findByUserId,
  findByToken,
};
