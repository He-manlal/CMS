import { NextResponse } from 'next/server';
import pool from '/app/lib/db';

export async function POST(request) {
  const connection = await pool.getConnection();

  try {
    // Extract values from the request body
    const { crime_name, law_applicable } = await request.json();

    // Validate required fields
    if (!crime_name || !law_applicable) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if the law already exists in the database
    const [existingLaw] = await connection.execute(
      'SELECT * FROM crime WHERE law_applicable = ?',
      [law_applicable]
    );

    if (existingLaw.length > 0) {
      // If the law already exists, respond with an error message
      return NextResponse.json({ message: 'Incorrect law: This law already exists in the database' }, { status: 400 });
    }

    // Begin a transaction (if necessary)
    await connection.beginTransaction();

    try {
      // Insert the new crime into the database
      const [result] = await connection.execute(
        'INSERT INTO crime (crime_name, law_applicable) VALUES (?, ?)',
        [crime_name, law_applicable]
      );

      // Commit the transaction
      await connection.commit();

      // Respond with success
      return NextResponse.json({ message: 'Crime added successfully', crimeId: result.insertId }, { status: 201 });
    } catch (error) {
      // Rollback transaction in case of an error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error adding crime:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Release the connection back to the pool
    await connection.release();
  }
}

