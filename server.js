const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');  // Import fs module to delete files

dotenv.config();
const app = express();

// Enable CORS for frontend to connect
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware to parse JSON requests
app.use(express.json());

// Define storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the directory where uploaded files are stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Set the file name (timestamp + extension)
  },
});

// File filter function to allow only specific file types
const fileFilter = (req, file, cb) => {
  // Allowed file types: .pdf, .docx, .csv
  const allowedTypes = ['.pdf', '.docx', '.csv'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(fileExtension)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only .pdf, .docx, and .csv files are allowed.'), false); // Reject the file
  }
};

// Initialize multer with fileFilter
const upload = multer({ 
  storage, 
  fileFilter, // Add fileFilter to restrict file types
});

// Route for file uploads
app.post('/api/files', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully',
    file: req.file,
  });
});

// Route to get uploaded files
app.get('/api/files', (req, res) => {
  const filesDirectory = './uploads';

  fs.readdir(filesDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading files' });
    }

    const fileDetails = files.map(file => ({
      originalname: file,
      path: `/uploads/${file}`, // Path to access the file
    }));

    res.json({ files: fileDetails });
  });
});

// Serve static files (uploads)
app.use('/uploads', express.static('uploads')); // Ensure that files can be accessed publicly

// Route to delete a file
app.delete('/api/files/:fileId', (req, res) => {
  const { fileId } = req.params; // This should be the file's name (e.g., '1732386741555.pdf')
  console.log(`Deleting file with ID: ${fileId}`);

  const filePath = path.join(__dirname, 'uploads', fileId);  // Construct file path

  // Try to delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).json({ error: 'Error deleting file' });
    }

    res.status(200).json({ message: 'File deleted successfully' });
  });
});

// Routes for authentication
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err.message));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
