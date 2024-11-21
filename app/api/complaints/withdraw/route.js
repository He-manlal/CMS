// /pages/api/complaints/withdraw.js
import { NextResponse } from 'next/server';
import pool from '/app/lib/db'; // Assuming pool is correctly set up for MySQL connection

export async function POST(req) {
  try {
    const { complaintId } = await req.json();

    if (!complaintId) {
      return NextResponse.json({ success: false, message: "Complaint ID is required." });
    }

    // Check if the complaint exists in the complaint table
    const [complaints] = await pool.query(
      'SELECT * FROM complaint WHERE complaint_id = ?',
      [complaintId]
    );

    if (complaints.length === 0) {
      return NextResponse.json({ success: false, message: "Complaint not found." });
    }

    // Check if the complaint exists in the investigation table
    const [investigations] = await pool.query(
      'SELECT * FROM investigation WHERE complaint_id = ?',
      [complaintId]
    );

    if (investigations.length === 0) {
      // Delete the complaint if it's not in the investigation table
      await pool.query('DELETE FROM complaint WHERE complaint_id = ?', [complaintId]);
      return NextResponse.json({
        success: true,
        message: "Complaint successfully deleted.",
      });
    }

    // Handle complaints present in the investigation table
    const investigationStatus = investigations[0].status;
    if (investigationStatus === 'Ongoing') {
      // Update status to 'Resolved'
      await pool.query(
        'UPDATE investigation SET status = ? WHERE complaint_id = ?',
        ['Resolved', complaintId]
      );
      return NextResponse.json({
        success: true,
        message: "The complaint will no longer be investigated.",
      });
    } else if (investigationStatus === 'Closed') {
      return NextResponse.json({
        success: false,
        message: "This complaint is in a court of law and cannot be deleted.",
      });
    } else if (investigationStatus === 'Resolved') {
      return NextResponse.json({
        success: false,
        message: "This complaint is already resolved.",
      });
    }

    return NextResponse.json({ success: false, message: "Unknown status." });
  } catch (error) {
    console.error("Error handling complaint withdrawal:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
}
