const db = require('../config/db');

/**
 * Admin login uses admins table (email + bcrypt hash). Optional: could use users with role=admin instead.
 */

async function findByEmail(email) {
  const res = await db.query(
    'SELECT id, email, password_hash FROM admins WHERE email = $1',
    [email]
  );
  return res.rows[0] || null;
}

module.exports = {
  findByEmail,
};
