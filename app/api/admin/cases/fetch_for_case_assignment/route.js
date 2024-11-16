import { NextResponse } from 'next/server';
import pool from '/app/lib/db';

export async function GET(request) {
  const connection = await pool.getConnection();

  try {
    // Run the query to fetch investigation_ids based on the conditions
    const [investigations] = await connection.execute(
      `
      SELECT i.investigation_id
      FROM investigation i
      WHERE i.status = 'Closed'
        AND EXISTS (
          SELECT 1
          FROM history h
          WHERE h.investigation_id = i.investigation_id
        )
        AND NOT EXISTS (
          SELECT 1
          FROM court_case c
          WHERE c.investigation_id = i.investigation_id
        );
      `
    );

    if (investigations.length === 0) {
      // No investigations found, return empty array instead of error message
      return NextResponse.json({ investigations: [] }, { status: 200 });
    }

    // Extract investigation_id from each result to return as an array
    const investigationIds = investigations.map((investigation) => investigation.investigation_id);

    // Respond with the list of investigation_ids
    return NextResponse.json({ investigations: investigationIds }, { status: 200 });
  } catch (error) {
    console.error('Error fetching investigations:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await connection.release();
  }
}
