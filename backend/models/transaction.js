const mongoose = require('mongoose');
const { Schema } = mongoose;
// Định nghĩa schema cho Book
const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  amount: Number,
  paidAt: { type: Date, default: Date.now },
});

// Tạo model từ schema
module.exports = mongoose.model('Transaction', transactionSchema);
