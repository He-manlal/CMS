"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(null); // Track login status
  const [userData, setUserData] = useState(null); // Store user data

  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !loginPassword) {
      alert("Please fill in all fields.");
      return;
    }

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password: loginPassword }),
    });

    const data = await response.json();

    if (data.success) {
      setLoginStatus("success");
      setUserData(data);
      localStorage.setItem("userEmail", email);

      // Redirect based on user type
      if (data.type_of_user === "Admin") {
        router.push("/admin");
      } else if (data.type_of_user === "Police") {
        router.push("/police");
      } else if (data.type_of_user === "Judge") {
        router.push("/judge");
      } else {
        router.push("/public_user");
      }
    } else {
      setLoginStatus("error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Login</h1>

        {loginStatus === "success" ? (
          <div>
            <h2 className="text-green-500 text-lg">Login Successful</h2>
            <p className="text-gray-700 mt-2">Welcome, {userData.message}!</p>
          </div>
        ) : (
          <div>
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="w-full p-3 mb-4 border border-gray-300 bg-gray-100 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 mb-4 border border-gray-300 bg-gray-100 text-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gray-800 text-white font-semibold rounded hover:bg-gray-700 transition duration-300"
            >
              Login
            </button>

            {loginStatus === "error" && (
              <p className="text-red-500 mt-4">
                Invalid credentials, please try again!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
