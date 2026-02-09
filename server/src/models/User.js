const db = require('../config/db');

/**
 * User model. Relationships:
 * - One User has one EmergencyProfile (1:1)
 * - One User has one QRToken (1:1, enforced in service layer)
 */

async function create({ name, email, passwordHash, mobile, role = 'user' }) {
  const res = await db.query(
    `INSERT INTO users (name, email, password_hash, mobile, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, mobile, role, created_at`,
    [name, email, passwordHash, mobile, role]
  );
  return res.rows[0];
}

async function findByEmail(email) {
  const res = await db.query(
    'SELECT id, name, email, password_hash, mobile, role, created_at FROM users WHERE email = $1',
    [email]
  );
  return res.rows[0] || null;
}

async function findById(id) {
  const res = await db.query(
    'SELECT id, name, email, mobile, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return res.rows[0] || null;
}

async function findByIdWithPassword(id) {
  const res = await db.query(
    'SELECT id, name, email, password_hash, mobile, role FROM users WHERE id = $1',
    [id]
  );
  return res.rows[0] || null;
}

module.exports = {
  create,
  findByEmail,
  findById,
  findByIdWithPassword,
};
