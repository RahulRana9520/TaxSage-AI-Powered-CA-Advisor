// Test PostgreSQL connection for TaxSage
import pool from '@/lib/database';

export async function GET() {
  try {
    // Test connection
    const client = await pool.connect();
    
    // Test query
    const result = await client.query('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = $1', ['public']);
    const userCount = await client.query('SELECT COUNT(*) as user_count FROM app_users');
    const expenseCount = await client.query('SELECT COUNT(*) as expense_count FROM expense_entries');
    
    client.release();

    return Response.json({
      success: true,
      message: 'TaxSage PostgreSQL connection successful!',
      data: {
        tables: result.rows[0].table_count,
        users: userCount.rows[0].user_count,
        expenses: expenseCount.rows[0].expense_count
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Database connection failed'
    }, { status: 500 });
  }
}
