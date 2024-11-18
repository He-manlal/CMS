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

    // Call the stored procedure to fetch complaints
    const [results] = await pool.execute('CALL GetUserComplaints(?)', [userId]);

    // Extract complaints from the result set
    const complaints = results[0];
    
    return NextResponse.json({ success: true, complaints });

  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json({ success: false, message: 'Error fetching complaints' }, { status: 500 });
  }
}
