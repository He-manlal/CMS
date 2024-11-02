// app/api/admin/get_unassigned_complaints/route.js
import { NextResponse } from 'next/server';
import pool from '/app/lib/db'; // Adjust path if needed

export async function GET() {
  try {
    const connection = await pool.getConnection();

    // Query to fetch complaints with the status "Yet to be assigned"
    const [complaints] = await connection.execute(
      'SELECT * FROM complaint WHERE status = ?',
      ['Yet to be assigned']
    );

    await connection.release();

    return NextResponse.json(complaints, { status: 200 });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
