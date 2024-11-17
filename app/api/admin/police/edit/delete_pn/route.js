import pool from '/app/lib/db';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { police_id, phone_number } = req.body;

    try {
      // Delete the specified phone number for the police officer
      await pool.query(
        'DELETE FROM police_phone_numbers WHERE police_id = ? AND phone_number = ?',
        [police_id, phone_number]
      );
      return res.status(200).json({ message: 'Phone number deleted successfully' });
    } catch (error) {
      console.error('Error deleting phone number:', error);
      return res.status(500).json({ message: 'Error deleting phone number' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
