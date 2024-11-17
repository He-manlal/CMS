// /app/api/cases/assign_hearing_date/route.js

import  pool  from "/app/lib/db"; // Ensure you have your database pool connection
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { caseId, hearingDate } = await req.json();

    // Validate inputs
    if (!caseId || !hearingDate) {
      return NextResponse.json(
        { error: "Missing caseId or hearingDate" },
        { status: 400 }
      );
    }

    const selectedDate = new Date(hearingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for date-only comparison

    if (selectedDate < today) {
      return NextResponse.json(
        { error: "Hearing date cannot be in the past" },
        { status: 400 }
      );
    }

    // Perform database update
    const query = `
      UPDATE court_case
      SET hearing_date = ?
      WHERE investigation_id = ?;
    `;

    const [result] = await pool.query(query, [selectedDate, caseId]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Case not found or update failed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Hearing date updated successfully" });
  } catch (error) {
    console.error("Error updating hearing date:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}