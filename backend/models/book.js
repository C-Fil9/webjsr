const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa schema cho Book
const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, enum: ['truyen', 'sach'], required: true }, // ví dụ
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  author: String,
  isPaid: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  contentUrl: String,
  coverImage: String,
  views: { type: Number, default: 0 },
  totalChapters: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Thêm virtual để lấy chapters
bookSchema.virtual('chapters', {
  ref: 'Chapter',
  localField: '_id',
  foreignField: 'bookId'
});

// Tạo model từ schema
const BookModel = mongoose.model('Book', bookSchema);
module.exports = BookModel;