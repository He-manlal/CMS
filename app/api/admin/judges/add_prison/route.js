import { NextResponse } from 'next/server';
import pool from '/app/lib/db';

export async function POST(request) {
  const connection = await pool.getConnection();

  try {
    // Extract values from the request body
    const { prison_name, location, capacity, warden } = await request.json();

    // Validate required fields
    if (!prison_name || !location || !capacity || !warden) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if the warden is already assigned to another prison
    const [existingWarden] = await connection.execute(
      'SELECT prison_id FROM prison WHERE prison_official_id = ?',
      [warden]
    );

    if (existingWarden.length > 0) {
      return NextResponse.json(
        { message: 'This official is already assigned to another prison' },
        { status: 400 }
      );
    }

    // Begin a transaction
    await connection.beginTransaction();

    try {
      // Insert prison record into the database, including the warden (prison_official_id)
      const [result] = await connection.execute(
        'INSERT INTO prison (prison_name, location, capacity, prison_official_id) VALUES (?, ?, ?, ?)',
        [prison_name, location, capacity, warden]
      );

      // Commit the transaction
      await connection.commit();

      // Respond with success
      return NextResponse.json(
        { message: 'Prison added successfully', prisonId: result.insertId },
        { status: 201 }
      );
    } catch (error) {
      // Rollback transaction in case of an error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error adding prison:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Release the connection back to the pool
    await connection.release();
  }
}
