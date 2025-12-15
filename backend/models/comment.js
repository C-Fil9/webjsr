const mongoose = require('mongoose');
const { Schema } = mongoose;

// Định nghĩa schema cho Book
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  content: String,
  rating: { type: Number, min: 1, max: 5 },
}, { timestamps: true });

// Tạo model từ schema
const CommentModel = mongoose.model('Comment', commentSchema);
module.exports = CommentModel;