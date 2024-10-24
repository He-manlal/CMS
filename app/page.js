"use client"

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Opened Index.js</h1>
      <div style={{ marginTop: '20px' }}>
        <Link href="/login">
          <button style={{ marginRight: '10px' }}>Login</button>
        </Link>
        <Link href="/register">
          <button>Signup</button>
        </Link>
      </div>
    </div>
  );
}
