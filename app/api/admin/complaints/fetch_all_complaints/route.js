import { NextResponse } from 'next/server';
import pool from '/app/lib/db'; 

export async function GET() {
  try {
    const [complaints] = await pool.query('SELECT * FROM complaint');

    // Prepare an array to hold complaints with additional investigation details
    const complaintsWithInvestigationDetails = await Promise.all(
      complaints.map(async (complaint) => {
        // Initialize the investigation object
        let investigation = null;

        // Check if the complaint status is 'Under Investigation' or 'Investigation Completed'
        if (complaint.status === 'Under Investigation' || complaint.status === 'Investigation Completed') {
          // Fetch investigation data for the complaint
          const [investigationDetails] = await pool.query(
            'SELECT * FROM investigation WHERE complaint_id = ?',
            [complaint.complaint_id]
          );

          // If investigation details are found, set the investigation object
          if (investigationDetails.length > 0) {
            investigation = investigationDetails[0];

            // Fetch officer details from the investigation_officer table
            const [officerDetails] = await pool.query(
              `SELECT p.Fname, p.Lname 
               FROM investigation_officer io 
               JOIN police_officials p ON io.police_id = p.police_id 
               WHERE io.investigation_id = ?`,
              [investigation.investigation_id]
            );

            // Add officer details to the investigation object
            if (officerDetails.length > 0) {
              investigation.officer = {
                fullName: `${officerDetails[0].Fname} ${officerDetails[0].Lname}`,
                police_id: officerDetails[0].police_id, // Include police_id if needed
              };
            } else {
              investigation.officer = null; // No officer assigned
            }
          }
        }

        // Return the complaint with investigation details
        return {
          ...complaint,
          investigation,
        };
      })
    );

    return NextResponse.json(complaintsWithInvestigationDetails, { status: 200 });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
