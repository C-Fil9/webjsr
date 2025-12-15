const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  bookTitle: {
    type: String,
    required: true
  },
  chapterNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  contentUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Tạo index để đảm bảo không có chapter trùng số trong cùng một truyện
chapterSchema.index({ bookId: 1, chapterNumber: 1 }, { unique: true });

module.exports = mongoose.model('Chapter', chapterSchema);