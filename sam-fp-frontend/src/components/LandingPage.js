import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-6">Welcome to the SAM Final Project Application</h1>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-600 px-4 py-2 rounded">Login</Link>
        <Link to="/register" className="bg-green-600 px-4 py-2 rounded">Register</Link>
      </div>
    </div>
  );
}

export default LandingPage;
