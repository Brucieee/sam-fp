const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const multer = require('multer');
const path = require('path');

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

const upload = multer({ storage });

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
  const fs = require('fs');
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
