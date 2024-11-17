// pages/api/admin/police/add_phone_number.js
import pool from '/app/lib/db';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { police_id, phone_number } = req.body;

    try {
      // Insert the new phone number for the specific police officer
      await pool.query(
        'INSERT INTO police_phone_numbers (police_id, phone_number) VALUES ($1, $2)',
        [police_id, phone_number]
      );
      return res.status(200).json({ message: 'Phone number added successfully' });
    } catch (error) {
      console.error('Error adding phone number:', error);
      return res.status(500).json({ message: 'Error adding phone number' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
