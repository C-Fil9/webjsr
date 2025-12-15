const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyToken = async (req, res, next) => {
  try {
    // Lấy token từ cookie hoặc header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Tìm user và gán vào request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    // Đảm bảo verifyToken đã chạy trước
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Kiểm tra role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { verifyToken, isAdmin };