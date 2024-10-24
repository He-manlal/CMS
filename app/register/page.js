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
    <div>
      <h1>Register Page</h1>
      <input
        type='text'
        name="email"
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type='password'
        name="password"
        placeholder="Password"
        onChange={e => setRegisterPassword(e.target.value)}
      />
      <button onClick={handleRegister} disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}
