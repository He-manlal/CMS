import { NextResponse } from 'next/server';
import pool from '/app/lib/db';

export async function POST(request) {
  const connection = await pool.getConnection();

  try {
    // Extract values from the request body
    const { fname, lname, dob, address, phone_number, email } = await request.json();

    // Validate required fields
    if (!fname || !lname || !dob) {
      return NextResponse.json({ message: 'First name, last name, and DOB are required' }, { status: 400 });
    }

    // Check if a similar record exists based on fname, lname, and dob
    const [existingCriminal] = await connection.execute(
      'SELECT * FROM criminal WHERE fname = ? AND lname = ? AND dob = ?',
      [fname, lname, dob]
    );

    if (existingCriminal.length > 0) {
      return NextResponse.json({ message: 'Criminal with the same name and date of birth already exists' }, { status: 409 });
    }

    // Begin a transaction
    await connection.beginTransaction();

    try {
      // Insert the new criminal into the database
      const [result] = await connection.execute(
        'INSERT INTO criminal (fname, lname, dob, address, phone_number, email) VALUES (?, ?, ?, ?, ?, ?)',
        [fname, lname, dob, address, phone_number, email]
      );

      // Commit the transaction
      await connection.commit();

      // Respond with success
      return NextResponse.json({ message: 'Criminal added successfully', criminalId: result.insertId }, { status: 201 });
    } catch (error) {
      // Rollback transaction in case of an error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error adding criminal:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Release the connection back to the pool
    await connection.release();
  }
}
