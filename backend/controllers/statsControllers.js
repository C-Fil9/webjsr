const Book = require('../models/book');
const User = require('../models/user');
const category = require('../models/category');


const stats = async (req, res) => {
  // Get statistics for the admin dashboard
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalCategories = await category.countDocuments();

    res.json({
      totalBooks,
      totalUsers,
      totalCategories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}

module.exports = {
  stats
}