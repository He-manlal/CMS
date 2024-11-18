import pool from '/app/lib/db'; // Import the database connection pool
import { NextResponse } from 'next/server';

export async function POST(req, res) {
    const { investigation_id, newEvidenceType, additionalData } = await req.json();
  
    if (!investigation_id || !newEvidenceType || !additionalData) {
        return NextResponse.json(
            { message: 'Investigation ID, evidence type, and additional data are required' },
            { status: 400 }
        );
    }
  
    try {
        // Call the stored procedure
        await pool.query('CALL AddEvidence(?, ?, ?)', [
            newEvidenceType,
            investigation_id,
            additionalData
        ]);

        return NextResponse.json({ message: 'Evidence updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating evidence:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
