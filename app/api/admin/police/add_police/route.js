import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import pool from '/app/lib/db'; // Adjust according to your project structure

export async function POST(request) {
  const connection = await pool.getConnection();

  try {
    const { Fname, Lname, DOB, police_rank, station, official_email, phoneNumbers } = await request.json();

    // Check if required fields are present
    if (!Fname || !Lname || !DOB || !police_rank || !station || !official_email) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Start a transaction
    await connection.beginTransaction();

    try {
      // Insert user into the users table
      const password = await bcrypt.hash('123456',10); // Encode email with JWT secret
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, password, type_of_user) VALUES (?, ?, ?)',
        [official_email, password, 'Police']
      );

      const users_id = userResult.insertId; // Get the newly created user's ID

      // Insert police officer data into police_officials table
      const [officerResult] = await connection.execute(
        'INSERT INTO police_officials (Fname, Lname, DOB, police_rank, station, official_email, users_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [Fname, Lname, DOB, police_rank, station, official_email, users_id]
      );

      const police_id = officerResult.insertId; // Get the newly created police officer's ID

      // Insert phone numbers into phone_numbers table
      for (const number of phoneNumbers) {
        if (number) { // Ensure the number is not empty
          await connection.execute(
            'INSERT INTO police_phone_numbers (phone_number, police_id) VALUES (?, ?)',
            [number, police_id]
          );
        }
      }

      // Commit transaction
      await connection.commit();
      return NextResponse.json({ message: 'Police officer added successfully' }, { status: 201 });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error adding police officer:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    // Ensure the connection is released back to the pool
    await connection.release();
  }
}


/*import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Adjust the path according to your project structure
import jwt from 'jsonwebtoken';

// POST request to add a police officer
export async function POST(request) {
  try {
    const { Fname, Lname, DOB, police_rank, station, official_email } = await request.json();

    // Check if required fields are present
    if (!Fname || !Lname || !DOB || !police_rank || !station || !official_email) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const password = jwt.sign(official_email, process.env.JWT_SECRET); // Encode email with JWT secret

    // Use the pool to get a connection
    const connection = await db.getConnection();

    try {
      // Start a transaction
      await connection.beginTransaction();

      // Create a new user in the users table
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, password, type_of_user) VALUES (?, ?, ?)',
        [official_email, password, 'Police']
      );

      const users_id = userResult.insertId; // Get the newly created user's ID

      // Insert police officer data into police_officials table
      await connection.execute(
        'INSERT INTO police_officials (Fname, Lname, DOB, police_rank, station, official_email, users_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [Fname, Lname, DOB, police_rank, station, official_email, users_id]
      );

      // Commit the transaction
      await connection.commit();

      return NextResponse.json({ message: 'Police officer added successfully' }, { status: 201 });
    } catch (error) {
      // Rollback the transaction in case of an error
      await connection.rollback();
      console.error('Error adding police officer:', error);
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
*/