const express = require('express');
const router = express.Router();
const { upload } = require('../config/s3');

// POST /api/upload
// The 'file' field matches the name attribute in the frontend formData
router.post('/', (req, res) => {
  upload.single('file')(req, res, function (err) {
    if (err) {
      console.error('Multer S3 Upload Error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Upload failed' });
    }
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // multer-s3 returns the uploaded file URL in req.file.location
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      url: req.file.location,
      key: req.file.key
    });
  });
});

module.exports = router;
