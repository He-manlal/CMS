import  pool  from '/app/lib/db';  
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { police_id } = await request.json();
  try {
    // Get `investigation_id` values associated with `police_id` in `investigation_officer` table
    const [investigations] = await pool.query(
      `SELECT investigation_id FROM investigation_officer WHERE police_id = ?`,
      [police_id]
    );

    console.log("Investigations:", investigations); // Log investigations to check the result


    // For each `investigation_id`, get the corresponding `complaint_id` from `investigation` table
    for (const { investigation_id } of investigations) {
      const [[investigation]] = await pool.query(
        `SELECT complaint_id FROM investigation WHERE investigation_id = ?`,
        [investigation_id]
      );

      if (investigation && investigation.complaint_id) {
        // Update the status of the complaint to "Yet to be assigned"
        await pool.query(
          `UPDATE complaint SET status = 'Yet to be assigned' WHERE complaint_id = ?`,
          [investigation.complaint_id]
        );
      }
    }

    await Promise.all([
      pool.query(`DELETE FROM investigation_officer WHERE police_id = ?`, [police_id]),
      pool.query(`DELETE FROM police_officials WHERE police_id = ?`, [police_id]),
      pool.query(`DELETE FROM police_phone_numbers WHERE police_id = ?`, [police_id])
    ]);


    return NextResponse.json({ ok: true, message: "Success" });
  } catch (error) {
    console.error('Error deleting police officer:', error);
    return NextResponse.json({ message: "Fail" });
  } 
}
