import pg from 'pg';
import { env } from '../config/env.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const res = await pool.query('SELECT 1 as ok');
    return res.rows[0]?.ok === 1;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}
