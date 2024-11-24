import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router for navigation

const Navbar = () => {

  const handleLogout = () => {
    // Handle logout logic (e.g., remove token from localStorage, etc.)
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page after logout
  };

  const handleBack = () => {
    // This will navigate the user to the previous page or home if there is no history
    window.history.back();
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Back Button on the left */}
        <button
          onClick={handleBack}
          className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
        >
          Back
        </button>


        {/* Navbar links */}
        <div className="space-x-6 hidden md:flex">
          <Link
            to="/account"
            className="hover:text-blue-400 py-2 px-4 rounded-md border-2 border-transparent hover:border-blue-400 transition duration-200"
          >
            Account
          </Link>
          <Link
            to="/uploaded-files"
            className="hover:text-blue-400 py-2 px-4 rounded-md border-2 border-transparent hover:border-blue-400 transition duration-200"
          >
            Upload Files
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu (Hamburger) */}
        <div className="md:hidden flex items-center">
          <button
            className="text-2xl"
            onClick={() => document.getElementById('mobile-menu').classList.toggle('hidden')}
          >
            &#9776;
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className="hidden md:hidden">
        <div className="flex flex-col items-center mt-4 space-y-4">
          <Link
            to="/account"
            className="hover:text-blue-400 py-2 px-4 rounded-md border-2 border-transparent hover:border-blue-400 transition duration-200"
          >
            Account
          </Link>
          <Link
            to="/upload"
            className="hover:text-blue-400 py-2 px-4 rounded-md border-2 border-transparent hover:border-blue-400 transition duration-200"
          >
            Upload Files
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
