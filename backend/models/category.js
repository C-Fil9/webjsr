const mongoose = require('mongoose');

// Định nghĩa schema cho Book
const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
});

// Tạo model từ schema
module.exports = mongoose.model('Category', categorySchema);
