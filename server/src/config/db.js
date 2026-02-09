/**
 * PostgreSQL connection pool. Uses DATABASE_URL from env.
 * One pool per process; reuse for all queries.
 */

const { Pool } = require('pg');

let pool = null;

function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }
    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    pool.on('error', (err) => {
      console.error('Unexpected DB pool error', err);
    });
  }
  return pool;
}

async function query(text, params = []) {
  const p = getPool();
  const start = Date.now();
  try {
    const res = await p.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development' && duration > 100) {
      console.warn(`Slow query (${duration}ms):`, text.substring(0, 80));
    }
    return res;
  } catch (err) {
    err.duration = Date.now() - start;
    throw err;
  }
}

async function end() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = {
  getPool,
  query,
  end,
};
