// app/api/admin/police/edit/get_pn.js
import pool from "/app/lib/db"; // Import the database pool

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { police_id } = req.body;

    if (!police_id) {
      return res.status(400).json({ message: 'Police ID is required' });
    }

    try {
      const result = await pool.query(
        'SELECT phone_number FROM police_phone_numbers WHERE police_id = ?',
        [police_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No phone numbers found for this police officer' });
      }

      // Return phone numbers as an array
      const phoneNumbers = result.rows.map(row => row.phone_number);
      return res.status(200).json({ phoneNumbers });
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
      return res.status(500).json({ message: 'Error fetching phone numbers' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
