import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import pool from '/app/lib/db'; // Adjust according to your project structure

export async function POST(request) {
  const connection = await pool.getConnection();

  try {
    const { Fname, Lname, DOB, police_rank, station, official_email, phoneNumbers } = await request.json();

    // Check if required fields are provided
    if (!Fname || !Lname || !DOB || !police_rank || !station || !official_email) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Check if there is at least one valid phone number
    const validPhoneNumbers = phoneNumbers?.filter((number) => number && typeof number === 'string' && number.trim() !== '');
    if (!validPhoneNumbers || validPhoneNumbers.length === 0) {
      return NextResponse.json({ message: 'At least one valid phone number is required' }, { status: 400 });
    }

    await connection.beginTransaction();

    try {
      // Generate hashed password
      const password = await bcrypt.hash('123456', 10);

      // Insert into users table
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, password, type_of_user) VALUES (?, ?, ?)',
        [official_email, password, 'Police']
      );

      const users_id = userResult.insertId;

      // Insert into police_officials table
      const [officerResult] = await connection.execute(
        'INSERT INTO police_officials (Fname, Lname, DOB, police_rank, station, official_email, users_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [Fname, Lname, DOB, police_rank, station, official_email, users_id]
      );

      const police_id = officerResult.insertId;

      // Insert valid phone numbers
      for (const number of validPhoneNumbers) {
        await connection.execute(
          'INSERT INTO police_phone_numbers (phone_number, police_id) VALUES (?, ?)',
          [number, police_id]
        );
      }

      // Commit transaction
      await connection.commit();
      return NextResponse.json({ message: 'Police officer added successfully' }, { status: 201 });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error adding police officer:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await connection.release();
  }
}
