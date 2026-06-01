const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 't4g_admin',
  host: process.env.DB_HOST || 't4g-data-db.cyneeec86meq.us-east-1.rds.amazonaws.com',
  database: process.env.DB_NAME || 't4g-data',
  password: process.env.DB_PASSWORD || '1Qaz4rfv..',
  port: process.env.DB_PORT || 5432,
  ssl: { rejectUnauthorized: false },
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS contactos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        asunto VARCHAR(255),
        mensaje TEXT NOT NULL,
        ip_origen VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla contactos lista');
  } catch (err) {
    console.error('Error inicializando DB:', err.message);
  } finally {
    client.release();
  }
};

module.exports = { pool, initDB };
