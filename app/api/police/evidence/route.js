// app/api/police/evidence/route.js
import pool from '/app/lib/db'; // Import the database connection pool
import { NextResponse } from 'next/server';

export async function POST(req, res) {
    const { investigation_id, newEvidenceType ,additionalData} = await req.json();
  
    if (!investigation_id || !newEvidenceType || !additionalData) {
      return NextResponse.json({ message: 'Investigation ID and new evidence type are required' }, { status: 400 });
    }
  
    try {
        if(newEvidenceType === 'Document'){
            await pool.query(
                'INSERT INTO evidence (evidence_type,investigation_id,document_path) VALUES (?,?,?)  ',
                [newEvidenceType, investigation_id,additionalData]
            );      
            return NextResponse.json({ message: 'Evidence updated successfully' }, { status: 200 });
        }else if(newEvidenceType === 'Image'){
            await pool.query(
                'INSERT INTO evidence (evidence_type,investigation_id,image_path) VALUES (?,?,?)  ',
                [newEvidenceType, investigation_id,additionalData]
            );      
            return NextResponse.json({ message: 'Evidence updated successfully' }, { status: 200 });
        }
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    } catch (error) {
      console.error('Error updating evidence:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }}