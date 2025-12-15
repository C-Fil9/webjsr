const cloudinary = require('cloudinary').v2;

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    
    // Kiểm tra xem publicId có phải là URL đầy đủ không
    if (publicId.startsWith('http')) {
      // Lấy public_id từ URL
      const urlParts = publicId.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex !== -1) {
        publicId = urlParts.slice(uploadIndex + 2).join('/').split('.')[0];
      }
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

module.exports = { deleteFromCloudinary };
