import { NextResponse } from 'next/server';
import pool from '/app/lib/db';

export async function POST(request) {
  const connection = await pool.getConnection();

  try {
    const { investigationId, selectedCriminal } = await request.json();

    // Validate required fields
    if (!investigationId || !selectedCriminal || !selectedCriminal.criminal_id) {
      return NextResponse.json({ message: 'Investigation ID and Criminal Search are required' }, { status: 400 });
    }

    // Look up the criminal_id based on the criminal search (fname and lname)
    const [criminal] = await connection.execute(
      'SELECT criminal_id FROM criminal WHERE CONCAT(fname, " ", lname) = ?',
      [`${selectedCriminal.fname} ${selectedCriminal.lname}`] // Concatenate fname and lname
    );

    if (!criminal.length) {
      return NextResponse.json({ message: 'Criminal not found' }, { status: 404 });
    }

    const criminalId = criminal[0].criminal_id;

    // Begin a transaction
    await connection.beginTransaction();

    try {
      // Insert the investigation and criminal data into the history table
      const [result] = await connection.execute(
        'INSERT INTO history (investigation_id, criminal_id) VALUES (?, ?)',
        [investigationId, criminalId]
      );

      // Commit the transaction
      await connection.commit();

      // Respond with success
      return NextResponse.json({ message: 'Chargesheet filed successfully', historyId: result.insertId }, { status: 201 });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error filing chargesheet:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await connection.release();
  }
}
