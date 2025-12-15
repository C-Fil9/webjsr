const express = require('express');
const router = express.Router();
const { 
  upload, 
  uploadCoverImage, 
  uploadBookContent, 
  deleteFileController 
} = require('../controllers/uploadControllers');

// Upload routes
router.post('/cover', upload.single('cover'), uploadCoverImage);
router.post('/content', upload.single('content'), uploadBookContent);
router.delete('/delete', deleteFileController);

module.exports = router;
