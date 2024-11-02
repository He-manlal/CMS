// app/api/admin/assign_complaint/route.js
import { NextResponse } from 'next/server';
import pool from '/app/lib/db'; // Adjust the path to your db connection file

export async function POST(request) {
  const connection = await pool.getConnection();
  try {
    const { complaint_id, police_id } = await request.json();

    // Start a transaction
    await connection.beginTransaction();

    // Fetch the `filed_by` value for the given `complaint_id`
    const [complaintResult] = await connection.query(
      'SELECT filed_by FROM complaint WHERE complaint_id = ?',
      [complaint_id]
    );

    if (complaintResult.length === 0) {
      await connection.rollback();
      return NextResponse.json({ message: 'Complaint not found' }, { status: 404 });
    }

    const filedBy = complaintResult[0].filed_by;

    // Step 1: Insert into `investigation` table and retrieve the generated `investigation_id`
    const [investigationResult] = await connection.query(
      'INSERT INTO investigation (complaint_id, initiated_by) VALUES (?, ?)',
      [complaint_id, filedBy]
    );

    const investigationId = investigationResult.insertId;

    // Step 2: Insert into `investigation_officer` table with `investigation_id` and `police_id`
    await connection.query(
      'INSERT INTO investigation_officer (investigation_id, police_id) VALUES (?, ?)',
      [investigationId, police_id]
    );

    // Step 3: Update the complaint status to 'Under Investigation'
    await connection.query(
      'UPDATE complaint SET status = ? WHERE complaint_id = ?',
      ['Under Investigation', complaint_id]
    );

    // Commit the transaction if all queries are successful
    await connection.commit();
    return NextResponse.json({ message: 'Complaint assigned successfully' }, { status: 200 });
  } catch (error) {
    // Roll back the transaction if any query fails
    await connection.rollback();
    console.error('Error assigning complaint:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Release the database connection
    connection.release();
  }
}
