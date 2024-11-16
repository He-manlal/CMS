{/*
import jwt from 'jsonwebtoken';
import pool from '/app/lib/db'; // Import the MySQL connection pool
import { NextResponse } from 'next/server';

export async function GET(req) {
  const token = req.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Token is missing' }, { status: 401 });
  }

  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch judge's details based on the user ID
    const [judgeRows] = await pool.query(
      `SELECT CONCAT(Fname, ' ', Lname) as name, court FROM judges WHERE users_id = ?`,
      [userId]
    );

    if (judgeRows.length === 0) {
      return NextResponse.json({ error: 'Judge not found' }, { status: 404 });
    }

    const judge = judgeRows[0];

    // Fetch assigned cases for the judge
    const [casesRows] = await pool.query(
      `SELECT c.id, c.title, c.hearing_date, e.type as evidence_type, e.description as evidence_description
       FROM court_case cc
       JOIN cases c ON cc.investigation_id = c.id
       LEFT JOIN evidence e ON c.id = e.case_id
       WHERE cc.judge_id = ?`,
      [userId]
    );

    // Group cases and evidence
    const cases = casesRows.reduce((acc, row) => {
      const caseIndex = acc.findIndex((item) => item.id === row.id);
      if (caseIndex === -1) {
        acc.push({
          id: row.id,
          title: row.title,
          hearingDate: row.hearing_date,
          evidence: [{ type: row.evidence_type, description: row.evidence_description }],
        });
      } else {
        acc[caseIndex].evidence.push({ type: row.evidence_type, description: row.evidence_description });
      }
      return acc;
    }, []);

    // Fetch the accused for each case
    for (const caseItem of cases) {
      const [accusedRows] = await pool.query(
        `SELECT criminal_id, name FROM case_accused WHERE case_id = ?`,
        [caseItem.id]
      );
      caseItem.accused = accusedRows;
    }

    return NextResponse.json({ judge, cases });
  } catch (error) {
    console.error('Error fetching judge details and cases:', error);
    return NextResponse.json({ error: 'Failed to retrieve judge information and cases' }, { status: 500 });
  }
}
*/}
import jwt from 'jsonwebtoken';
import pool from '/app/lib/db'; // Import the MySQL connection pool
import { cookies } from 'next/headers'; // For accessing cookies in Next.js server components
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Retrieve the token from cookies (works server-side only)
    const token = (await cookies()).get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Token is missing' }, { status: 401 });
    }

    // Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch judge's ID based on the user ID
    const [judgeRows] = await pool.query(
      `SELECT judge_id, CONCAT(Fname, ' ', Lname) as name, court FROM judges WHERE users_id = ?`,
      [userId]
    );

    if (judgeRows.length === 0) {
      return NextResponse.json({ error: 'Judge not found' }, { status: 404 });
    }

    const judge = judgeRows[0];
    const judgeId = judge.judge_id;

    // Fetch cases assigned to the judge
    const [casesRows] = await pool.query(
      'SELECT cc.investigation_id, cc.hearing_date FROM court_case cc WHERE cc.judge_id = ?'
,
      [judgeId]
    );

    const cases = [];

    for (const caseRow of casesRows) {
      // Fetch the accused for each case using investigation_id
      const [accusedRows] = await pool.query(
        `SELECT h.criminal_id, CONCAT(cr.Fname, ' ', cr.Lname) as name 
         FROM history h
         JOIN criminal cr ON h.criminal_id = cr.criminal_id
         WHERE h.investigation_id = ?`,
        [caseRow.investigation_id]
      );

      // Fetch evidence for each case using investigation_id
      const [evidenceRows] = await pool.query(
        `SELECT 
            e.evidence_id, e.evidence_type, 
            CASE 
                WHEN e.evidence_type = 'image' THEN e.image_path
                WHEN e.evidence_type = 'document' THEN e.document_path
                ELSE NULL 
            END AS file_path
        FROM evidence e
        WHERE e.investigation_id = ?`
        , [caseRow.investigation_id]
      );

      // Construct the case object
      cases.push({
        id: caseRow.investigation_id,
        title: caseRow.title,
        hearingDate: caseRow.hearing_date,
        accused: accusedRows,
        evidence: evidenceRows,
      });
    }

    return NextResponse.json({ judge, cases });
  } catch (error) {
    console.error('Error fetching judge details and cases:', error);
    return NextResponse.json({ error: 'Failed to retrieve judge information and cases' }, { status: 500 });
  }
}
