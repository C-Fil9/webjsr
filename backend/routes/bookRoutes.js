const { getAllBooks, getBookById, createBook, updateBook, deleteBook, searchBooks, getBooksByCategory } = require('../controllers/bookManageControllers');
const express = require('express');
const router = express.Router();


router.get('/admin/books', getAllBooks);
router.get('/admin/search', searchBooks);
router.get('/admin/filter/:id', getBooksByCategory);
router.post('/admin/createbooks', createBook);
router.get('/admin/books/:id', getBookById);
router.patch('/admin/books/:id', updateBook);
router.delete('/admin/books/:id', deleteBook);

module.exports = router;