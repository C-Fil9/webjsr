const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Chapter = require('../models/chapter');
const Book = require('../models/book');

// Cấu hình multer để lưu file tạm thời
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload ảnh bìa
const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file ảnh.' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'book_covers',
      resource_type: 'image'
    });

    // Xóa file tạm sau khi upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

// Upload nội dung sách
const uploadBookContent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nội dung.' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'book_contents',
      resource_type: 'raw'
    });

    // Xóa file tạm sau khi upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

// Upload chapter
const uploadChapter = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file chapter.' });
    }


    const { bookId, chapterNumber, title } = req.body;

    if (!bookId || !chapterNumber || !title) {
      return res.status(400).json({ error: 'Thiếu thông tin cần thiết.' });
    }

    const book = await Book.findById(bookId);
    book.totalChapters = Chapter.countDocuments({ bookId }); 
    await book.save();
    if (!book) {
      return res.status(404).json({ error: 'Không tìm thấy truyện.' });
    }

    const existingChapter = await Chapter.findOne({ 
      bookId, 
      chapterNumber: parseInt(chapterNumber) 
    });

    if (existingChapter) {
      return res.status(400).json({ error: 'Chapter này đã tồn tại.' });
    }

    const safeFolderName = book.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: `books/${safeFolderName}/chapters`,
      resource_type: 'raw'
    });

    // Xóa file tạm sau khi upload
    fs.unlinkSync(req.file.path);

    const chapter = new Chapter({
      bookId,
      bookTitle: book.title,
      chapterNumber: parseInt(chapterNumber),
      title,
      contentUrl: result.secure_url,
      publicId: result.public_id
    });

    await chapter.save();

    res.status(200).json({
      message: 'Upload chapter thành công',
      chapter: {
        id: chapter._id,
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        contentUrl: chapter.contentUrl
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
};

// Lấy danh sách chapters
const getChapters = async (req, res) => {
  try {
    const { bookId } = req.params;
    const chapters = await Chapter.find({ bookId })
      .sort({ chapterNumber: 1 })
      .select('chapterNumber title contentUrl');
    res.status(200).json(chapters);
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({ error: 'Failed to get chapters' });
  }
};

// Xóa chapter
const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Delete request received for chapter ID:', id);

    if (!id) {
      console.log('No chapter ID provided');
      return res.status(400).json({ message: 'Chapter ID is required' });
    }

    // Tìm chapter trước khi xóa
    const chapter = await Chapter.findById(id);
    console.log('Found chapter:', chapter);

    if (!chapter) {
      console.log('Chapter not found with ID:', id);
      return res.status(404).json({ message: 'Chapter not found' });
    }

    // Xóa file trên Cloudinary nếu có
    if (chapter.contentUrl && chapter.contentUrl.startsWith('http')) {
      try {
        const publicId = getPublicIdFromUrl(chapter.contentUrl);
        console.log('Cloudinary public ID:', publicId);

        if (publicId) {
          // Thêm options để xóa file raw
          const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'raw',
            invalidate: true
          });
          console.log('Cloudinary delete result:', result);

          if (result.result === 'not found') {
            console.log('File not found in Cloudinary, continuing with chapter deletion');
          }
        } else {
          console.log('Could not extract public ID from URL:', chapter.contentUrl);
        }
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        // Tiếp tục xóa chapter ngay cả khi xóa file thất bại
      }
    }

    // Xóa chapter từ database
    const deletedChapter = await Chapter.findByIdAndDelete(id);
    console.log('Deleted chapter from database:', deletedChapter);

    if (!deletedChapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    res.json({ 
      message: 'Chapter deleted successfully',
      deletedChapter 
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      message: 'Error deleting chapter',
      error: error.message 
    });
  }
};

// Helper function để lấy public_id từ URL Cloudinary
const getPublicIdFromUrl = (url) => {
  try {
    console.log('Processing URL:', url); // Debug log

    // Kiểm tra nếu URL không phải là URL Cloudinary
    if (!url.includes('cloudinary.com')) {
      console.log('Not a Cloudinary URL');
      return null;
    }

    // Tìm phần public_id trong URL
    // URL format: https://res.cloudinary.com/cloud_name/raw/upload/v1/folder1/folder2/filename.pdf
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      console.log('No upload segment found in URL');
      return null;
    }

    // Lấy tất cả các phần sau 'upload' và giữ nguyên phần mở rộng file
    const publicIdParts = urlParts.slice(uploadIndex + 1);
    const publicId = publicIdParts.join('/');
    
    console.log('Extracted public ID with extension:', publicId);
    return publicId;
  } catch (error) {
    console.error('Error getting public ID:', error);
    return null;
  }
};

// Xóa file
const deleteFileController = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) {
      return res.status(400).json({ error: 'Thiếu public ID của file' });
    }

    await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ message: 'Xóa file thành công' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Xóa file thất bại' });
  }
};

module.exports = {
  upload,
  uploadCoverImage,
  uploadBookContent,
  uploadChapter,
  getChapters,
  deleteChapter,
  deleteFileController
};