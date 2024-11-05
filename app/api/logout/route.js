// pages/api/logout.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
      // Logic to handle token invalidation on the server (if necessary)
      // This could include clearing a server-side session, etc.
      // For example, if using a session-based system, you would destroy the session here
  
      // For JWT, you typically don't invalidate it on the server
      // Instead, you trust that the token will expire
  
      res.status(200).json({ success: true, message: 'Logged out successfully.' });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  