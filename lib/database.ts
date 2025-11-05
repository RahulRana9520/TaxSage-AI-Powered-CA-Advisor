// Database configuration for TaxSage PostgreSQL (Supabase)
import { Pool } from 'pg';

// Supabase connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to TaxSage Supabase PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Supabase PostgreSQL connection error:', err);
});

// Health check function
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection healthy:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

export default pool;
