import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import pool from '/app/lib/db'; 

export async function POST(request) {
  const connection = await pool.getConnection();

  try {
    const { Fname, Lname, DOB, court, official_email, phoneNumbers } = await request.json();

    if (!Fname || !Lname || !DOB || !court || !official_email) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    await connection.beginTransaction();

    try {
      const password = await bcrypt.hash('987654', 10);
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, password, type_of_user) VALUES (?, ?, ?)',
        [official_email, password, 'Judge']
      );

      const users_id = userResult.insertId;

      const [judgeResult] = await connection.execute(
        'INSERT INTO judges (Fname, Lname, DOB, court, official_email, users_id) VALUES (?, ?, ?, ?, ?, ?)',
        [Fname, Lname, DOB, court, official_email, users_id]
      );

      const judge_id = judgeResult.insertId;

      for (const number of phoneNumbers) {
        if (number) {
          await connection.execute(
            'INSERT INTO judge_phone_numbers (phone_number, judge_id) VALUES (?, ?)',
            [number, judge_id]
          );
        }
      }

      await connection.commit();
      return NextResponse.json({ message: 'Judge added successfully' }, { status: 201 });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error adding judge:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await connection.release();
  }
}
