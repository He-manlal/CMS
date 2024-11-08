import pool from '/app/lib/db'; // Ensure this path is correct

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');

  try {
    let query;
    switch (role) {
      case "Police Officer":
        query = 'SELECT police_id AS id, CONCAT(Fname, " ", Lname) AS name, "Police Officer" AS role FROM police_officials';
        break;
      case "Judge":
        query = 'SELECT judge_id AS id, CONCAT(Fname, " ", Lname) AS name, "Judge" AS role FROM judges';
        break;
      case "Prison Official":
        query = 'SELECT prison_official_id AS id, CONCAT(Fname, " ", Lname) AS name, "Prison Official" AS role FROM prison_officials';
        break;
      default:
        return new Response(JSON.stringify({ error: 'Invalid role' }), { status: 400 });
    }

    const [rows] = await pool.query(query); // Use db.query with the connection pool
    return new Response(JSON.stringify({ officials: rows }), { status: 200 });
  } catch (error) {
    console.error('Error fetching officials:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch officials' }), { status: 500 });
  }
}
