import pool from '/app/lib/db'; // Import the pool from your database connection helper
import { format } from 'date-fns'; // To format the date
import { NextResponse } from 'next/server';

export async function POST(req, res) {
  // Parse the request body
  const { investigation_id, judge_id } = await req.json();
  console.log('Received Investigation ID:', investigation_id);
  console.log('Received Judge ID:', judge_id);

  // Validate the request body
  if (!investigation_id || !judge_id) {
    return NextResponse.json({ error: 'Investigation ID and Judge ID are required' });
  }

  try {
    // Format the date to one month from today
    const oneMonthFromToday = format(new Date(new Date().setMonth(new Date().getMonth() + 1)), 'yyyy-MM-dd');
    console.log('Hearing Date:', oneMonthFromToday);

    try {
      // Corrected SQL query syntax
      const [result] = await pool.query(
        `INSERT INTO court_case (investigation_id, judge_id, hearing_date) VALUES (?, ?, ?)`,
        [investigation_id, judge_id, oneMonthFromToday]
      );

      console.log('Database Result:', result);

      // Check if rows were affected (useful if there is any logic related to affected rows)
      if (result.affectedRows === 0) {
        return NextResponse.json({ message: 'No case was assigned', result });
      }

      return NextResponse.json({ message: 'Case successfully assigned to judge', result });
    } catch (error) {
      console.error('Error executing query:', error);
      return NextResponse.json({ error: 'Failed to assign case to judge' });
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return NextResponse.json({ error: 'Database connection error' });
  }
}


