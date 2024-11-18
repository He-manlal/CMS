import { NextResponse } from 'next/server';
import pool from '/app/lib/db'; 

export async function GET() {
  try {
    // Call the stored procedure
    const [results] = await pool.query('CALL GetDashboardStats()');

    // Extract the first row of results
    const dashboardStats = results[0][0];
    return NextResponse.json(dashboardStats, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
