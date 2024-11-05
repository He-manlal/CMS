// pages/api/get-current-user.js
export default function handler(req, res) {
  if (req.method === "GET") {
    // Mocked user data, simulating an authenticated user session
    const user = { userId: "123", name: "John Doe" };
    return res.status(200).json(user);
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

