const { getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryControllers');
const express = require('express');
const router = express.Router();


// Category routes
router.get('/admin/categories', getAllCategories);
router.post('/admin/categories', createCategory);
router.patch('/admin/categories/:id', updateCategory);
router.delete('/admin/categories/:id', deleteCategory);

module.exports = router;
