// routes/files.js (assuming you're storing files separately in a `files` route)

const express = require('express');
const File = require('../models/File'); // Adjust according to your file model
const authMiddleware = require('../middleware/authMiddleware'); // Assuming the middleware is in the same folder

const router = express.Router();

// Delete a file (only accessible to admin users)
// routes/files.js

// Delete a file
router.delete('/:fileId', authMiddleware, async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check if the user is authorized to delete the file
        if (req.user.id !== file.user.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Delete the file from the file system (assuming you use fs to save files)
        const filePath = path.join(__dirname, '../uploads', file.filename);
        fs.unlinkSync(filePath);  // Delete the file

        // Remove the file from the database
        await file.remove();
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
