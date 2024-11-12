import { NextResponse } from 'next/server';
import pool from '/app/lib/db';

export async function GET(request) {
  // Extract the search term from the query parameters using request.nextUrl
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('searchTerm');

  if (!searchTerm) {
    return NextResponse.json({ message: 'Search term is required' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();

    // Query to search for criminals by name
    const [criminals] = await connection.execute(
      'SELECT fname, lname, criminal_id FROM criminal WHERE CONCAT(fname, " ", lname) LIKE ?',
      [`%${searchTerm}%`]
    );

    await connection.release();

    if (criminals.length === 0) {
      return NextResponse.json({ message: 'No criminals found matching the search term' }, { status: 404 });
    }

    return NextResponse.json(criminals, { status: 200 });
  } catch (error) {
    console.error('Error searching criminals:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
