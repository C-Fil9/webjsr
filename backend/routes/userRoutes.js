const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateRollUser, deleteUser, updateBalance } = require('../controllers/userManageControllers');
const { isAdmin, verifyToken } = require('../middlewares/auth');


router.get('/admin/users', getAllUsers);
router.get('/admin/users/:id', getUserById);
router.patch('/admin/users/:id', updateRollUser);
router.delete('/admin/users/:id', verifyToken, isAdmin, deleteUser);
router.patch('/admin/users/:id/balance', updateBalance);

module.exports = router;