const User = require('../models/user');
const Book = require('../models/book');
const { hashPassword, comparePasswords } = require('../helpers/auth');
// Import necessary modules
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { upload, uploadCoverImage, uploadBookContent, deleteFileController } = require('../controllers/uploadControllers');

const test = (req, res) => {
  res.json({ message: 'Hello from the server!' });
}
// Register endpoint
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    // check name
    if (!name) {
      return res.json({ error: 'Name is required' });
    }
    // check password
    if (!password || password.length < 6) {
      return res.json({ error: 'Password must be at least 6 characters long' });
    }
    // check confirm password
    if (password !== confirmPassword) {
      return res.json({ error: 'Passwords do not match' });
    }
    // check email duplicate
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({ error: 'Email is already taken' });
    }
    // hash password
    const hashedPassword = await hashPassword(password);
    // create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });
    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email 
      },
      message: 'User created successfully'
    });
  } catch (error) {
    console.log(error);
    return res.json({ error: 'Something went wrong' });
  }
}

// Login endpoint
const loginUser = async (req, res) => {
  // Login a registered user
  try {
    const { email, password } = req.body;
    // check email 
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: 'Invalid email' });
    }
    // check password
    const match = await comparePasswords(password, user.password);
    if (match) {
      jwt.sign(
        { 
          email: user.email, 
          id: user._id, 
          name: user.name
        },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Error signing token' });
          }

          // Set the cookie and send response
          res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
          }).json({
            message: 'Login successful',
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          });
        });
    }
    if (!match) {
      return res.json({ error: 'password does not match' });
    }
  }
  catch (error) {
    console.log(error);
    return res.json({ error: 'Something went wrong' });
  }
}

// forgot password endpoint
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ error: "User not found" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10m' });

  const resetLink = `http://localhost:5173/reset-password/${token}`;

  // Tạo transporter Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,     
      pass: process.env.EMAIL_PASSWORD   
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password',
    html: `<p>Click here to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ message: 'Reset link has been sent to your email, link expires in 10 minutes.' });
  } catch (err) {
    console.error(err);
    return res.json({ error: 'Failed to send reset email' });
  }
};


// Reset password endpoint
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.json({ error: 'Password must be at least 6 characters' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await hashPassword(password);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });
    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.log(err);
    res.json({ error: 'Token expired or invalid' });
  }
};

// Logout endpoint
const logoutUser = async (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
}

// get profile endpoint
const getProfile = async (req, res) => {
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) throw err;
      const user = await User.findById(decoded.id)
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance || 0,
        role: user.role,
        purchasedBooks: user.purchasedBooks || [],
        avatar: user.avatar || null
      });
    });
  } else {
    res.json(null);
  }
}

// update profile endpoint
const updateProfile = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, avatar } = req.body; // avatar là URL (nếu bạn đã có chức năng upload ảnh)

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { ...(name && { name }), ...(avatar && { avatar }) },
      { new: true }
    );

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      message: 'Cập nhật thông tin thành công',
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Không thể cập nhật hồ sơ' });
  }
};

// change password endpoint
const changePassword = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu mới phải ít nhất 6 ký tự' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const match = await comparePasswords(oldPassword, user.password);
    if (!match) return res.status(400).json({ error: 'Mật khẩu cũ không đúng' });

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Mật khẩu đã được cập nhật thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi cập nhật mật khẩu' });
  }
}

const purchasedBook = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate({
      path: "purchasedBooks",
      populate: { path: "category" }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user.purchasedBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách truyện đã mua' });
  }
}

const buyedBook = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { bookId } = req.params;

    const book = await Book.findById(bookId).select('price isPaid');
    if (!book) return res.status(404).json({ message: 'Truyện không tồn tại' });

    if (!book.isPaid || book.price === 0) {
      return res.json({ message: 'Truyện miễn phí' });
    }

    const user = await User.findById(userId);

    if (user.purchasedBooks.includes(bookId)) {
      return res.status(400).json({ message: 'Bạn đã mua truyện này rồi' });
    }

    if (user.balance < book.price) {
      return res.status(400).json({ message: 'Số dư không đủ' });
    }

    user.balance -= book.price;
    user.purchasedBooks.push(bookId);
    await user.save();

    res.json({
      message: 'Mua truyện thành công',
      balance: user.balance,
      bookId
    });
  } catch (err) {
    console.error('Lỗi mua truyện:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

module.exports = { test, registerUser, loginUser, logoutUser, getProfile, forgotPassword, resetPassword, updateProfile, changePassword, purchasedBook, buyedBook, router };