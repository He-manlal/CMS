"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

export default function Register() {
  const [email, setEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [typeOfUser, setTypeOfUser] = useState('Public');
  const [loading, setLoading] = useState(false); // Add loading state

  const router = useRouter(); // Initialize useRouter

  const handleRegister = async () => {
    // Check if email and password are provided
    if (!email || !registerPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (!email.endsWith('@gmail.com')) {
      alert("Email must end with @gmail.com");
      return;
    }

    setLoading(true); // Start loading
    try {
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: registerPassword, type_of_user: typeOfUser }),
      });

      const data = await response.json();
      if (response.ok) {
        // Registration successful
        alert("Registration successful!");
        console.log(data);
        router.push('/login'); // Redirect to the login page immediately
      } else {
        // Registration failed
        alert("Registration failed: " + data.message);
        console.error("Error:", data);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/register.jpg')" }}>
      <div className="bg-white bg-opacity-60 backdrop-blur-lg p-10 rounded-xl shadow-xl w-96 max-w-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Register</h1>

        <input
          type="text"
          name="email"
          placeholder="Email"
          className="w-full p-4 mt-4 mb-6 rounded-md border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-4 mb-6 rounded-md border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          onChange={e => setRegisterPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}
