import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const UploadedFilesPage = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://18.143.64.225/api/files', {
          headers: { 'x-auth-token': localStorage.getItem('token') },
        });
        setFiles(response.data.files);
      } catch (error) {
        console.error('Error fetching files:', error);
        alert('Error fetching files');
      }
    };

    const fetchUserDetails = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserName(decodedToken.name);
        setIsAdmin(decodedToken.isAdmin || false);
      }
    };

    fetchFiles();
    fetchUserDetails();
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file.');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
    ];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only .pdf, .docx, and .csv files are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://18.143.64.225/api/files', formData, {
        headers: { 'x-auth-token': localStorage.getItem('token'), 'Content-Type': 'multipart/form-data' },
      });
      alert('File uploaded successfully');
      setFiles((prevFiles) => [...prevFiles, response.data.file]);
    } catch (error) {
      console.error(error);
      alert('Error uploading file');
    }
  };

  const handleDeleteFile = async (filePath) => {
    const fileId = filePath.split('/').pop();
    if (!fileId) return;

    try {
      await axios.delete(`http://18.143.64.225/api/files/${fileId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setFiles((prevFiles) => prevFiles.filter((file) => file.path !== filePath));
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {userName || 'Guest'}!</h1>
        <h2 className="text-2xl font-semibold mb-4">Uploaded Files</h2>

        <form onSubmit={handleFileUpload} className="bg-gray-800 p-6 rounded shadow-md mb-6">
          <label className="block mb-4">
            <span className="block mb-2">Select a file (PDF, DOCX, CSV):</span>
            <input
              type="file"
              accept=".pdf,.docx,.csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full px-4 py-2 bg-gray-700 text-white rounded"
              required
            />
          </label>
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 rounded hover:bg-green-600"
          >
            Upload
          </button>
        </form>

        <div>
          {files.length === 0 ? (
            <p className="text-center">No files uploaded.</p>
          ) : (
            files.map((file) => (
              <div key={file.originalname} className="bg-gray-700 p-4 mb-4 rounded shadow-md">
                <a
                  href={`http://18.143.64.225${file.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {file.originalname}
                </a>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteFile(file.path)}
                    className="ml-4 bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadedFilesPage;
