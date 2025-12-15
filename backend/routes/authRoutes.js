const express = require('express');
const router = express.Router();
const { 
  test, 
  registerUser, 
  loginUser, 
  logoutUser, 
  getProfile, 
  forgotPassword, 
  resetPassword, 
  updateProfile, 
  changePassword, 
  purchasedBook, 
  buyedBook 
} = require('../controllers/authControllers');

// Public routes
router.get('/test', test);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/profile', getProfile);
router.patch('/update', updateProfile);
router.get('/purchased-books', purchasedBook);
router.post('/buyed-book/:bookId', buyedBook);
router.post('/change-password', changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;