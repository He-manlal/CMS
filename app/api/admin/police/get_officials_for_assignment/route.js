// app/api/admin/get_officials/route.js
import { NextResponse } from 'next/server';
import pool from '/app/lib/db'; // Adjust the path if necessary

export async function GET() {
  try {
    // Fetch the list of officials with their IDs and names
    const [officials] = await pool.query(
      'SELECT police_id, Fname, Lname FROM police_officials'
    );

    return NextResponse.json(officials, { status: 200 });
  } catch (error) {
    console.error('Error fetching police officials:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
