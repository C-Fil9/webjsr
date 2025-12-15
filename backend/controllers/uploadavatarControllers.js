const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models/user');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('avatar');

const updateAvatar = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) return res.status(400).json({ error: 'Upload error' });

    const { token } = req.cookies;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Xóa avatar cũ từ Cloudinary nếu có
      if (user.avatar) {
        const publicId = user.avatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload avatar mới lên Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatars',
        resource_type: 'image'
      });

      // Xóa file tạm sau khi upload
      fs.unlinkSync(req.file.path);

      // Cập nhật URL avatar mới
      user.avatar = result.secure_url;
      await user.save();

      res.json({
        message: 'Cập nhật ảnh đại diện thành công',
        url: user.avatar
      });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: 'Có lỗi xảy ra khi cập nhật ảnh' });
    }
  });
};

module.exports = { updateAvatar };