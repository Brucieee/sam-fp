import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadedFilesPage = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/files', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        console.log(response.data);
        setFiles(response.data.files);
      } catch (error) {
        console.error('Error fetching files:', error);
        alert('Error fetching files');
      }
    };

    // Fetch username from the token (JWT)
    const fetchUserDetails = () => {
      const token = localStorage.getItem('token');
      if (token) {
        console.log("Token:", token);  // Log token to check its structure
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
        console.log("Decoded Token:", decodedToken);  // Log decoded token
    
        if (decodedToken && decodedToken.name) {
          setUserName(decodedToken.name);  // Set the name if available
        }
      }
    };
    

    fetchFiles();
    fetchUserDetails();  // Get the username

  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/files', formData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      alert('File uploaded successfully');
      setFiles(prevFiles => [...prevFiles, response.data.file]);
    } catch (error) {
      console.error(error);
      alert('Error uploading file');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const handleGoToAccount = () => {
    navigate('/account');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
      {/* Top bar with Logout and Account navigation */}
      <div className="absolute top-0 right-0 p-4 space-x-4">
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
        <button onClick={handleGoToAccount} className="bg-green-600 text-white px-4 py-2 rounded">
          Go to Account
        </button>
      </div>
      
      {/* Welcome message */}
      <h1 className="text-4xl mb-6">Welcome, {userName || 'Guest'}!</h1>

      <h2 className="text-xl mb-4">Uploaded Files</h2>

      <form onSubmit={handleFileUpload} className="space-y-4 mb-6">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="p-2 rounded bg-gray-800 w-64"
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded w-64">Upload</button>
      </form>

      <div>
        {files.map((file, index) => (
          <div key={index} className="bg-gray-700 p-4 mb-2 rounded">
            <a href={`http://localhost:5000${file.path}`} target="_blank" rel="noopener noreferrer">
              {file.originalname}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedFilesPage;
