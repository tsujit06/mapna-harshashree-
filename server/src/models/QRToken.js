const db = require('../config/db');

/**
 * QR token: one per user. token is the secure random string in /e/:token.
 * UNIQUE on user_id enforces one-QR-per-user at DB level.
 */

async function create(userId, token) {
  const res = await db.query(
    `INSERT INTO qr_tokens (user_id, token) VALUES ($1, $2)
     RETURNING id, user_id, token, is_active, created_at`,
    [userId, token]
  );
  return res.rows[0];
}

async function findByToken(token) {
  const res = await db.query(
    'SELECT id, user_id, token, is_active, created_at FROM qr_tokens WHERE token = $1',
    [token]
  );
  return res.rows[0] || null;
}

async function findByUserId(userId) {
  const res = await db.query(
    'SELECT id, user_id, token, is_active, created_at FROM qr_tokens WHERE user_id = $1',
    [userId]
  );
  return res.rows[0] || null;
}

async function setActive(tokenId, isActive) {
  const res = await db.query(
    'UPDATE qr_tokens SET is_active = $1 WHERE id = $2 RETURNING id, user_id, token, is_active',
    [isActive, tokenId]
  );
  return res.rows[0] || null;
}

async function setActiveByToken(token, isActive) {
  const res = await db.query(
    'UPDATE qr_tokens SET is_active = $1 WHERE token = $2 RETURNING id, user_id, token, is_active',
    [isActive, token]
  );
  return res.rows[0] || null;
}

/** Check if token exists and is active (for public route). */
async function isActiveToken(token) {
  const res = await db.query(
    'SELECT id FROM qr_tokens WHERE token = $1 AND is_active = TRUE',
    [token]
  );
  return res.rows.length > 0;
}

module.exports = {
  create,
  findByToken,
  findByUserId,
  setActive,
  setActiveByToken,
  isActiveToken,
};
