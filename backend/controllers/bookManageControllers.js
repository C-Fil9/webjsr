const Book = require('../models/book');
const Category = require('../models/category');
const Chapters = require('../models/chapters');
const fs = require('fs');
const path = require('path');

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('category');
    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching books' });
  }
}

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category');

    if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });

    // ✅ Tăng lượt xem
    book.views = (book.views || 0) + 1;
    // lấy số lượng chapters từ  totalChapters
    book.totalChapters = await Chapters.countDocuments({book: _id }); // Cập nhật tổng số chương
    book.coverImage = coverImage;
    await book.save();

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
};

const createBook = async (req, res) => {
  const { title, author, description, price, category, type, contentUrl, coverImage, isPaid } = req.body;
  
  // Validate category có tồn tại (nếu có model Category, thêm check)
  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  try {
    const newBook = new Book({
      title,
      author,
      description,
      price: isPaid ? price : 0, // nếu không trả phí thì giá 0
      category,
      type,
      contentUrl,
      coverImage,
      isPaid
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

const removeFile = (fileUrl) => {
  // Nếu là URL, chỉ lấy phần sau `/uploads/`
  const uploadsIndex = fileUrl.indexOf('/uploads/');
  if (uploadsIndex === -1) return; // Không hợp lệ

  const relativePath = fileUrl.substring(uploadsIndex); // "/uploads/covers/abc.jpg"
  const fullPath = path.join(__dirname, '..', relativePath); // Dẫn đến đúng file trong hệ thống

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
    console.log('Đã xóa:', fullPath);
  } else {
    console.warn('Không tìm thấy file:', fullPath);
  }
};

const updateBook = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    author,
    description,
    type,
    price,
    category,
    isPaid,
    contentUrl,
    coverImage,
    oldCoverImage,
    oldContentUrl
  } = req.body;

  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Nếu ảnh mới khác ảnh cũ, xóa ảnh cũ
    if (oldCoverImage && oldCoverImage !== coverImage) {
      removeFile(oldCoverImage);
    }
    // Nếu file nội dung mới khác file cũ, xóa file cũ
    if (oldContentUrl && oldContentUrl !== contentUrl) {
      removeFile(oldContentUrl);
    }

    // Cập nhật
    book.title = title;
    book.author = author;
    book.description = description;
    book.type = type;
    book.price = price;
    book.category = category;
    book.isPaid = isPaid;
    book.totalChapters = await Chapters.countDocuments({ book: _id }); // Cập nhật tổng số chương
    book.coverImage = coverImage;
    book.contentUrl = contentUrl;

    await book.save();
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Update failed' });
  }
};


const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    // Xóa file ảnh bìa nếu tồn tại
    if (book.coverImage) {
      removeFile(book.coverImage);
    }
    // Xóa file nội dung nếu tồn tại
    if (book.contentUrl) {
      removeFile(book.contentUrl);
    }
    // Xóa sách trong DB
    await book.deleteOne();
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Failed to delete book' });
  }
};

const searchBooks = async (req, res) => {
  try {
    const { title, category } = req.query;

    const query = {};
    if (title) {
      query.title = { $regex: title, $options: 'i' }; // không phân biệt hoa thường
    }
    if (category) {
      query.category = category;
    }

    const books = await Book.find(query).populate('category');
    res.json(books);
  } catch (error) {
    console.error('Lỗi khi tìm kiếm sách:', error);
    res.status(500).json({ message: 'Lỗi server khi tìm kiếm sách' });
  }
};

const getBooksByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const books = await Book.find({ category: categoryId }).populate('category');
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server khi lọc theo thể loại' });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
  getBooksByCategory
}