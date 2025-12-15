const express = require('express');
const router = express.Router();
const { 
  upload,
  uploadChapter,
  getChapters, 
  deleteChapter,
  deleteFileController
} = require('../controllers/uploadControllers');
const { getChapterContent } = require('../controllers/chapterControllers');
const { verifyToken } = require('../middlewares/auth');

// Áp dụng middleware xác thực cho tất cả các routes
router.use(verifyToken);

// Chapter routes
router.post('/upload', upload.single('chapter'), uploadChapter);
router.get('/:bookId', getChapters);
router.delete('/:id', deleteChapter);
router.get('/:id/content', getChapterContent);

module.exports = router;
