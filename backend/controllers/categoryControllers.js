const Category = require('../models/category');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Tên thể loại đã tồn tại' });

    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi thêm thể loại' });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Không tìm thấy thể loại' });

    category.name = name;
    category.description = description;
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật thể loại' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Không tìm thấy thể loại' });

    await category.deleteOne();
    res.json({ message: 'Xoá thể loại thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xoá thể loại' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
