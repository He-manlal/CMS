import { NextResponse } from 'next/server';
import pool from '/app/lib/db'; 

export async function GET() {
  try {
    // Query to get the total counts from their respective tables
    const complaintsQuery = 'SELECT COUNT(*) as total FROM complaint';
    const activeCasesQuery = 'SELECT COUNT(*) as total FROM investigation where status = "Ongoing"';
    const policeOfficersQuery = 'SELECT COUNT(*) as total FROM police_officials';
    const judgesQuery = 'SELECT COUNT(*) as total FROM judges';
    const courtCasesQuery = 'SELECT COUNT(*) as total FROM court_case';

    const [complaints] = await pool.query(complaintsQuery);
    const [activeCases] = await pool.query(activeCasesQuery);
    const [policeOfficers] = await pool.query(policeOfficersQuery);
    const [judges] = await pool.query(judgesQuery);
    const [courtCases] = await pool.query(courtCasesQuery); 

    // Prepare the response object
    const dashboardStats = {
      totalComplaints: complaints[0].total,
      activeCases: activeCases[0].total,
      policeOfficers: policeOfficers[0].total,
      judges: judges[0].total,
      courtCases : courtCases[0].total
    };

    return NextResponse.json(dashboardStats, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
