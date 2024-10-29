// app/api/complaints/getComplaints.js
import { NextResponse } from 'next/server';
import pool from '/app/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request) {
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

    // Query to fetch the previous complaints filed by the user
    const [complaints] = await pool.execute(
      `SELECT complaint_id, description, date_of_crime, nature_of_crime, filed_against, status, date_filed 
       FROM complaint 
       WHERE filed_by = ?`,
      [userId]
    );

    return NextResponse.json({ success: true, complaints });

  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json({ success: false, message: 'Error fetching complaints' }, { status: 500 });
  }
}
