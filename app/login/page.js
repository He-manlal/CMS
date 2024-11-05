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
      localStorage.setItem('userEmail', email); 
      
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
    <div style={styles.container}>
      <h1 style={styles.heading}>Login Page</h1>

      {loginStatus === 'success' ? (
        <div>
          <h2 style={styles.successMessage}>Login Successful</h2>
          <p style={styles.welcomeMessage}>Welcome, {userData.message}!</p> {/* Display user-specific data */}
        </div>
      ) : (
        <div>
          <input
            type='text'
            name="email"
            placeholder="Email"
            style={styles.input}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type='password'
            name="password"
            placeholder="Password"
            style={styles.input}
            onChange={e => setLoginPassword(e.target.value)}
          />
          <button onClick={handleLogin} style={styles.button}>Login</button>

          {/* Show an error message if login fails */}
          {loginStatus === 'error' && <p style={styles.errorMessage}>Invalid credentials, please try again!</p>}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#121212', // Dark background
    color: '#ffffff', // Light text color
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(255, 255, 255, 0.1)', // Lighter shadow for contrast
  },
  heading: {
    marginBottom: '20px',
  },
  input: {
    width: '300px',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #444', // Darker border
    backgroundColor: '#1e1e1e', // Dark input background
    color: '#ffffff', // Light input text
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff', // Blue button
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  successMessage: {
    color: '#4caf50', // Green color for success
  },
  welcomeMessage: {
    margin: '10px 0',
  },
  errorMessage: {
    color: 'red', // Red color for errors
  },
};
