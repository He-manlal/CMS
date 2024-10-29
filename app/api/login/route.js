import jwt from 'jsonwebtoken';  
import { NextResponse } from "next/server";
import pool from "/app/lib/db";
import bcrypt from 'bcrypt';

export async function POST(request) {
  const { email, password } = await request.json();
  const secretKey = process.env.JWT_SECRET;  

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length > 0) {
      const user = rows[0];
      console.log("User", user);
      console.log("Entered password:", password);
      console.log("Hashed password from DB:", user.password);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isMatch);

      if (isMatch) {
        const userId = user.id;
        
        // Create a JWT token with the user ID
        const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });

        // Set the token as an HTTP-only cookie
        return new NextResponse(JSON.stringify({ success: true, message: "Login successful" }), {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600`
          },
        });
      } else {
        return new NextResponse(JSON.stringify({ success: false, message: "Invalid credentials" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      return new NextResponse(JSON.stringify({ success: false, message: "Email does not exist." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify({ success: false, message: "Error processing request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
