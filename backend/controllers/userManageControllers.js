const User = require('../models/user');
const { deleteFromCloudinary } = require('../utils/cloudinary');

const getAllUsers = async (req, res) => {
  // Get all users from the database
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

const getUserById = async (req, res) => {
  // Get a user by ID from the database
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

const updateRollUser = async (req, res) => {
    // Update a user's role in the database
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user' });
    }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa' });
    res.json({ message: 'Xóa người dùng thành công' });
    // If the user has an avatar, delete it from Cloudinary
    if (user.avatar) {
      await deleteFromCloudinary(user.avatar.public_id);
    }
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server khi xóa người dùng' });
  }
};

const updateBalance = async (req, res) => {
  // Update a user's balance in the database
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User không tồn tại' });

    user.balance = amount;
    await user.save();

    res.json({ message: 'Cập nhật số dư thành công', balance: user.balance });
  } catch (err) {
    console.error("Lỗi cập nhật số dư:", err);
    res.status(500).json({ message: 'Lỗi server' });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  updateRollUser,
  deleteUser,
  updateBalance
}