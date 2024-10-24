import { NextResponse } from "next/server";
import pool from "/app/lib/db";
import bcrypt from 'bcrypt';

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    // Log the email for debugging
    console.log("Email:", email);

    // Query to check if the email exists
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    // Log the user information from the database
    console.log("User from DB:", rows);

    if (rows.length > 0) {
      const user = rows[0];

      // Log the passwords for debugging
      console.log("Entered password:", password);
      console.log("Hashed password from DB:", user.password);

      // Compare the entered password with the hashed password in the DB
      const isMatch = await bcrypt.compare(password, user.password);

      // Log the result of the comparison
      console.log("Password match:", isMatch);

      if (isMatch) {
        // If the password is correct, return success
        return new NextResponse(JSON.stringify({ success: true, message: "Login successful" }), {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // If the password is incorrect, return invalid credentials
        return new NextResponse(JSON.stringify({ success: false, message: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      // If email doesn't exist, return invalid credentials
      return new NextResponse(JSON.stringify({ success: false, message: "Email does not exist." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error(error);  // Log the error for debugging
    return new NextResponse(JSON.stringify({ success: false, message: "Error processing request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
