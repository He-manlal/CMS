"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const images = [
    '/images/1.png',
    '/images/2.png',
    '/images/3.png',
    '/images/4.png',
    '/images/5.png',
];


  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Top Right Buttons */}
      <div className="flex justify-end p-4">
        <Link href="/login">
          <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300 mr-2">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 transition duration-300">
            Signup
          </button>
        </Link>
      </div>

      {/* Main Content with Slider */}
      <div className="flex flex-grow">
        {/* Main Text Content */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-4xl font-bold">Welcome to the Crime Management System</h1>
        </div>

        {/* Slider */}
        <div className="w-1/4 relative flex items-center justify-center p-4">
          <div
            className="w-full h-96 bg-cover bg-center rounded-lg shadow-lg transition-all duration-500"
            style={{ backgroundImage: `url(${images[currentImage]})` }}
          />
        </div>
      </div>

      {/* Footer or additional content can be added here */}
    </div>
  );
}
