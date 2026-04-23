import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

let pool = null;

if (databaseUrl) {
  pool = mysql.createPool({
    uri: databaseUrl,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

export async function query(sql, params = []) {
  if (!pool) {
    throw new Error('Database not configured');
  }

  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function getConnection() {
  if (!pool) {
    throw new Error('Database not configured');
  }

  return pool.getConnection();
}

export async function pingDatabase() {
  if (!pool) {
    return false;
  }

  const connection = await pool.getConnection();
  try {
    await connection.ping();
    return true;
  } finally {
    connection.release();
  }
}

export default pool;
