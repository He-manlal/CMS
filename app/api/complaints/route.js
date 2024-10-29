import { NextResponse } from 'next/server';
import pool from '/app/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  const secretKey = process.env.JWT_SECRET;
  
  try {
    // Retrieve token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    // Verify the token to get the userId
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;

    // Get data from the request body
    const { natureOfCrime, description, date_of_crime, filedAgainst } = await request.json();

    // Insert complaint into the database
    const [result] = await pool.execute(
      `INSERT INTO complaint (description, date_of_crime, nature_of_crime, filed_by, filed_against) VALUES (?, ?, ?, ?, ?)`,
      [description, date_of_crime, natureOfCrime, userId, filedAgainst]
    );

    return NextResponse.json({ success: true, message: 'Complaint submitted successfully', complaintId: result.insertId });

  } catch (error) {
    console.error("Error submitting complaint:", error);
    return NextResponse.json({ success: false, message: 'Error submitting complaint' }, { status: 500 });
  }
}
