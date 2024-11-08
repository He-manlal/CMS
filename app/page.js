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
  const [isClient, setIsClient] = useState(false); // Add a state to track if it's client-side

  useEffect(() => {
    setIsClient(true); // Set this to true when the component mounts on the client

    const interval = setInterval(() => {
      setCurrentImage((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  // Random quote logic
  const quotes = [
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Injustice anywhere is a threat to justice everywhere.",
    "The best way to predict the future is to create it.",
    "Crime does not pay, but the protection of society does.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  const messages = [
    "Submit reports and let authorities manage crime effectively.",
    "Track and resolve crime cases efficiently.",
    "Help make society safer with your reports.",
    "Ensure justice is served through proper case management.",
    "Contribute to a better, safer community."
  ];

  if (!isClient) {
    // Return a static layout on the server
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center p-4 md:p-6">
      {/* White Inner Container with min height */}
      <div className="bg-white rounded-3xl shadow-lg w-[95%] min-h-full p-6 md:p-10">
        {/* Top Right Buttons */}
        <div className="flex justify-end space-x-2 mb-8">
          <Link href="/login">
            <button className="btn btn-error font-semibold shadow-md">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="btn btn-warning font-semibold shadow-md">
              Register
            </button>
          </Link>
        </div>

        {/* Main Content with Slider and Text */}
        <div className="relative flex flex-col md:flex-col items-center justify-between gap-8">
          {/* Image Background with Text Overlay */}
          <div className="relative w-full h-[60vh] md:h-[60vh] bg-cover bg-center rounded-lg shadow-lg transition-all duration-500">
            {/* Image Section */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${images[currentImage]})` }}
            ></div>

            {/* Text Section Div with Background Blur */}
            <div className="absolute inset-0 flex items-center justify-start bg-black bg-opacity-40 text-white p-6">
              <div className="h-[100%] relative">
                {/* Apply Blur Effect to Text Background */}
                <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-lg rounded-lg"></div>
                <div className="relative z-10 p-6">
                  <h1 className="text-6xl md:text-6xl font-extrabold">
                    <span className="text-orange-500">Crime Management System</span>
                  </h1>
                  <p className="text-base md:text-lg mt-2 font-bold">Submit reports and let authorities manage crime effectively.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Random Quote Section */}
          <div className="mt-8 p-6 bg-black bg-opacity-10 text-center rounded-lg">
            <p className="italic text-lg">{randomQuote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
