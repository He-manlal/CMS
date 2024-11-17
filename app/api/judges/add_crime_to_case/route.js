import pool from "/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { investigationId, crimeId } = await req.json();

    // Validate that investigationId and crimeId are provided
    if (!investigationId || !crimeId) {
      return NextResponse.json(
        { message: "Investigation ID and Crime ID are required." },
        { status: 400 }
      );
    }

    // Fetch the case_id associated with the provided investigationId
    const [rows] = await pool.query(
      "SELECT case_id FROM court_case WHERE investigation_id = ?",
      [investigationId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "No case found for the provided investigation ID." },
        { status: 404 }
      );
    }

    const caseId = rows[0].case_id;

    // Fetch the crime name from the crime table based on the provided crimeId
    const [crimeRows] = await pool.query(
      "SELECT crime_name FROM crime WHERE crime_id = ?",
      [crimeId]
    );

    if (crimeRows.length === 0) {
      return NextResponse.json(
        { message: "No crime found for the provided crime ID." },
        { status: 404 }
      );
    }

    const crimeName = crimeRows[0].crime_name;

    // Insert the caseId and crimeId into the court_case_crime table
    const [result] = await pool.query(
      "INSERT INTO court_case_crime (case_id, crime_id) VALUES (?, ?)",
      [caseId, crimeId]
    );

    return NextResponse.json(
      { 
        message: `Crime "${crimeName}" has been successfully added to case #${caseId}.`,
        insertedId: result.insertId
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning crime:", error);
    return NextResponse.json(
      { message: "An error occurred while assigning the crime." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Fetch all crimes from the crime table
    const [crimes] = await pool.query("SELECT * FROM crime");

    return NextResponse.json({ crimes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching crimes:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching crimes." },
      { status: 500 }
    );
  }
}
