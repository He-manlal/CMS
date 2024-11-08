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
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/login.jpg')" }}>
      <div className="bg-white bg-opacity-60 backdrop-blur-lg p-10 rounded-xl shadow-xl w-96 max-w-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Login</h1>

        {loginStatus === 'success' ? (
          <div>
            <h2 className="text-green-500 text-center">Login Successful</h2>
            <p className="text-center mt-2">Welcome, {userData.message}!</p>
          </div>
        ) : (
          <div>
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
              onChange={e => setLoginPassword(e.target.value)}
            />
            <button 
              onClick={handleLogin} 
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
            >
              Login
            </button>

            {loginStatus === 'error' && (
              <p className="text-red-500 text-center mt-4">Invalid credentials, please try again!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
