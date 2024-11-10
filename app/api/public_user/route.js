// app/api/public_user/route.js

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  const secretKey = process.env.JWT_SECRET;
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Error decoding token:", error);
    return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 403 });
  }
}
