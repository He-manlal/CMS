import  pool  from '/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse incoming request data
    const body = await req.json();
    const { caseId, verdict } = body;

    // Input validation
    if (!caseId || !verdict) {
      return NextResponse.json({ error: 'Case ID and verdict are required' }, { status: 400 });
    }

    // Call the stored procedure to update history status
    await pool.query('CALL update_history_status(?, ?)', [caseId, verdict]);

    // Optional: Update the court_case table to set the verdict
    await pool.query(
      'UPDATE court_case SET verdict = ? WHERE investigation_id = ?',
      [verdict, caseId]
    );

    return NextResponse.json({ message: `Verdict updated for case ID ${caseId}` }, { status: 200 });
  } catch (error) {
    console.error('Error updating verdict:', error);
    return NextResponse.json({ error: 'An error occurred while updating the verdict' }, { status: 500 });
  }
}