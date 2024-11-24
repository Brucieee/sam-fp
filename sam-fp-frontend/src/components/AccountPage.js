import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; // Ensure Navbar is imported

const AccountPage = () => {
  // State variables for user information, password update form, and error handling
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch user data when the component is mounted
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login'; // Redirect to login if no token
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://18.143.64.225:5000:5000/api/auth/me', {
          headers: { 'x-auth-token': token }, // Include token in the header
        });
        setUser(response.data);
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  // Handle form submission to update account info
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    const token = localStorage.getItem('token');

    // Validate required fields
    if (!newPassword || !currentPassword || !name || !email) {
      setError('Please fill in all the fields.');
      return;
    }

    try {
      // Make the PUT request to update user data
      const response = await axios.put(
        'http://18.143.64.225:5000/api/auth/update', // Ensure the correct endpoint
        { name, email, currentPassword, newPassword }, // Send the updated data
        { headers: { 'x-auth-token': token } } // Include the token in the header for authentication
      );
      
      setSuccessMessage(response.data.message); // Show success message
      setNewPassword('');
      setCurrentPassword('');
      setError(''); // Clear any error message

    } catch (err) {
      console.error('Error updating user data or password:', err);
      setError(err.response?.data?.message || 'Failed to update user data'); // Handle error message from server
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar /> {/* Navbar component */}
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Account Information</h1>

        {/* User Info Display */}
        {user ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <p><strong>Username:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        ) : (
          <p>{error || 'Loading user data...'}</p>
        )}

        <div className="mt-8">
          {/* Form to Update User Data and Password */}
          <h2 className="text-xl font-semibold mb-4">Update Account</h2>
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm">Username</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 mt-2 rounded-md bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mt-2 rounded-md bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="currentPassword" className="block text-sm">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 mt-2 rounded-md bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 mt-2 rounded-md bg-gray-700 text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Update Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
