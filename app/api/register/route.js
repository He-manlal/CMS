import { NextResponse } from "next/server";
import pool from "/app/lib/db"; // Adjust path if necessary
import bcrypt from 'bcrypt';

export async function POST(request) {
  const { email, password, type_of_user } = await request.json();

  // Check for missing data
  if (!email || !password || !type_of_user) {
    return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
  }

  try {
    // Check if user already exists
    const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 409 });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const result = await pool.query("INSERT INTO users (email, password, type_of_user) VALUES (?, ?, ?)", [email, hashedPassword, type_of_user]);

    console.log("User registered successfully:", result);

    return NextResponse.json({ success: true, message: "User registered successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error.message); // Log the specific error message
    return NextResponse.json({ success: false, message: "Error processing registration" }, { status: 500 });
  }
}
