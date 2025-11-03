// src/pages/TestDashboard.jsx
import React from 'react';
import Navbar from '../components/Navbar';

export default function TestDashboard() {
  console.log('TestDashboard RENDERED');

  return (
    <div className="min-h-screen bg-green-500 flex flex-col items-center justify-center text-white">
      <Navbar user={{ name: 'Test User', avatar: '/logo.jpg' }} />
      <h1 className="text-6xl font-bold mt-10">TEST DASHBOARD IS ALIVE!</h1>
      <p className="text-2xl mt-4">No DashboardBuild → No Crash</p>
      <button 
        onClick={() => alert('IT WORKS!')} 
        className="mt-8 px-8 py-4 bg-white text-green-500 rounded text-xl font-bold"
      >
        CLICK ME
      </button>
    </div>
  );
}