import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import pool from '/app/lib/db'; // Adjust according to your project structure

export async function POST(request) {
  const connection = await pool.getConnection();

  try {
    const { Fname, Lname, DOB, official_email, phoneNumbers } = await request.json();

    if (!Fname || !Lname || !DOB || !official_email) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    await connection.beginTransaction();

    try {
      // Create user entry
      const password = await bcrypt.hash('456789', 10);
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, password, type_of_user) VALUES (?, ?, ?)',
        [official_email, password, 'Prison Official']
      );

      const users_id = userResult.insertId;

      // Insert prison official details
      const [officialResult] = await connection.execute(
        'INSERT INTO prison_officials (Fname, Lname, DOB, official_email, users_id) VALUES (?, ?, ?, ?, ?)',
        [Fname, Lname, DOB, official_email, users_id]
      );

      const prison_official_id = officialResult.insertId;

      // Insert phone numbers
      for (const number of phoneNumbers) {
        if (number) {
          await connection.execute(
            'INSERT INTO prison_official_phone_numbers (phone_number, prison_official_id) VALUES (?, ?)',
            [number, prison_official_id]
          );
        }
      }

      await connection.commit();
      return NextResponse.json({ message: 'Prison official added successfully' }, { status: 201 });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error adding prison official:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await connection.release();
  }
}
