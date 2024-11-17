"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const images = [
    "/images/crime_1.jpg",
    "/images/crime_2.jpg",
    "/images/crime_3.jpg",
    "/images/crime_4.jpg",
    "/images/crime_5.jpg",
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const quotes = [
    "Justice will not be served until those who are unaffected are as outraged as those who are.",
    "The guilty may escape, but the innocent should never suffer.",
    "Every crime leaves a trail — it's time to uncover it.",
    "In the fight against crime, silence is not an option.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 md:p-6">
      {/* Inner Container */}
      <div className="bg-gray-800 text-gray-100 rounded-3xl shadow-lg w-[95%] min-h-full p-6 md:p-10">
        {/* Top Right Buttons */}
        <div className="flex justify-end space-x-2 mb-8">
          <Link href="/login">
            <button className="px-6 py-2 border border-gray-400 rounded hover:bg-gray-600 hover:border-gray-500 transition">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="px-6 py-2 border border-gray-400 rounded hover:bg-gray-600 hover:border-gray-500 transition">
              Register
            </button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="relative flex flex-col items-center gap-8">
          {/* Image Slider */}
          <div className="relative w-full h-[60vh] bg-gray-700 rounded-lg overflow-hidden shadow-lg">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${images[currentImage]})` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 p-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg"></div>
                <div className="relative z-10 p-6 text-center">
                  <h1 className="text-4xl md:text-5xl font-bold uppercase text-white">
                    Crime <span className="text-gray-300">Management System</span>
                  </h1>
                  <p className="text-lg mt-4 text-gray-300">
                    Investigate, report, and combat crime with precision.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Random Quote Section */}
          <div className="mt-8 p-6 bg-gray-700 text-center rounded-lg shadow">
            <p className="italic text-gray-300 text-lg">{randomQuote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
