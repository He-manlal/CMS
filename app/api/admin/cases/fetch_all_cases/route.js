// /pages/api/cases/fetch.js
import { NextResponse } from 'next/server';
import pool from '/app/lib/db'; // Assuming pool is correctly set up for MySQL connection

export async function GET() {
  try {
    // Fetch all cases from the court_cases table and join with the judges table to get judge's name
    const [cases] = await pool.query(`
      SELECT cc.case_id, cc.investigation_id, cc.judge_id, j.Fname AS judge_first_name, j.Lname AS judge_last_name
      FROM court_case cc
      LEFT JOIN judges j ON cc.judge_id = j.judge_id
    `);

    if (cases.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "No court cases found."
      });
    }

    // Format the response with full judge name
    const formattedCases = cases.map((caseItem) => ({
      caseId: caseItem.case_id,
      investigationId: caseItem.investigation_id,
      judgeName: `${caseItem.judge_first_name} ${caseItem.judge_last_name}`,
    }));

    return NextResponse.json({
      success: true,
      data: formattedCases,
    });
  } catch (error) {
    console.error("Error fetching court cases:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching court cases.",
    });
  }
}
