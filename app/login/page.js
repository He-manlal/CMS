"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);  // State to track login status
  const [userData, setUserData] = useState(null);  // State to store user data

  const router = useRouter();

  const handleLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password: loginPassword }),
    });

    const data = await response.json();

    if (data.success) {
      setLoginStatus('success');  // Set status as successful
      setUserData(data);
      
      // Redirect based on type_of_user
      if (data.type_of_user === 'Admin') {
        router.push('/admin');
      } else if(data.type_of_user === 'Police'){
          router.push('/police')
      } else {
        router.push('/public_user'); // Assuming you have a public-user page
      }
    } else {
      setLoginStatus('error');  // Set status as error
    }
  };

  return (
    <div>
      <h1>Login Page</h1>

      {loginStatus === 'success' ? (
        <div>
          <h2>Login Successful</h2>
          <p>Welcome, {userData.message}!</p> {/* Display user-specific data */}
        </div>
      ) : (
        <div>
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
            onChange={e => setLoginPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>

          {/* Show an error message if login fails */}
          {loginStatus === 'error' && <p style={{ color: 'red' }}>Invalid credentials, please try again!</p>}
        </div>
      )}
    </div>
  );
}
