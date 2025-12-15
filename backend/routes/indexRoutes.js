const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const uploadRoutes = require('./uploadRoutes');
const chapterRoutes = require('./chapterRoutes');
const bookRoutes = require('./bookRoutes');
const categoryRoutes = require('./categoryRoute');
const userRoutes = require('./userRoutes');
const statsRoutes = require('./statsRoutes');
const avatarRoutes = require('./avatarRouter');

// Auth routes
router.use('/auth', authRoutes);

// Upload routes
router.use('/upload', uploadRoutes);

// Chapter routes
router.use('/chapters', chapterRoutes);

// Book routes
router.use('/books', bookRoutes);

// Category routes
router.use('/categories', categoryRoutes);

// User routes
router.use('/users', userRoutes);

// Stats routes
router.use('/stats', statsRoutes);

// Avatar routes
router.use('/avatar', avatarRoutes);

module.exports = router; 