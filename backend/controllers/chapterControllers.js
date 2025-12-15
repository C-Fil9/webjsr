const Chapter = require('../models/chapter');
const cloudinary = require('../config/cloudinary');
const axios = require('axios');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');

const getChapterContent = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    if (chapter.contentUrl && chapter.contentUrl.startsWith('http')) {
      try {
        // Tạo signed URL từ Cloudinary
        const publicId = getPublicIdFromUrl(chapter.contentUrl);
        console.log('Public ID:', publicId); // Debug log

        // Tạo signed URL
        const signedUrl = cloudinary.url(publicId, {
          resource_type: 'raw',
          sign_url: true,
        });
        console.log('Signed URL:', signedUrl); // Debug log

        // Tải file từ signed URL
        const response = await axios.get(signedUrl, {
          responseType: 'arraybuffer',
          headers: {
            'Authorization': `Basic ${Buffer.from(process.env.CLOUDINARY_API_KEY + ':' + process.env.CLOUDINARY_API_SECRET).toString('base64')}`
          }
        });

        // Xác định loại file
        const fileType = getFileType(chapter.contentUrl);
        console.log('File type:', fileType); // Debug log
        
        let content;
        if (fileType === 'docx') {
          // Xử lý file Word
          const result = await mammoth.convertToHtml({ buffer: response.data });
          content = result.value;
        } else if (fileType === 'pdf') {
          // Xử lý file PDF
          const pdfData = await pdfParse(response.data);
          content = convertPdfToHtml(pdfData.text);
        } else {
          throw new Error(`Unsupported file type: ${fileType}`);
        }

        // Gửi HTML về client
        res.set('Content-Type', 'text/html');
        return res.send(content);
      } catch (error) {
        console.error('Error converting file:', error);
        return res.status(500).json({ 
          message: 'Error converting chapter content',
          error: error.message 
        });
      }
    }

    // Nếu contentUrl là đường dẫn local
    res.sendFile(chapter.contentUrl);
  } catch (error) {
    console.error('Error getting chapter content:', error);
    res.status(500).json({ message: 'Error getting chapter content' });
  }
};

// Hàm lấy public_id từ URL Cloudinary
const getPublicIdFromUrl = (url) => {
  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+?)$/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (error) {
    console.error('Error getting public ID:', error);
    return null;
  }
};



// Hàm xác định loại file từ URL
const getFileType = (url) => {
  try {
    // Lấy phần mở rộng từ URL
    const extension = url.split('.').pop().toLowerCase();
    console.log('File extension:', extension); // Debug log

    // Kiểm tra các định dạng phổ biến
    if (extension === 'docx' || extension === 'doc') {
      return 'docx';
    }
    if (extension === 'pdf') {
      return 'pdf';
    }

    // Kiểm tra trong URL có chứa từ khóa không
    if (url.toLowerCase().includes('word') || url.toLowerCase().includes('docx')) {
      return 'docx';
    }
    if (url.toLowerCase().includes('pdf')) {
      return 'pdf';
    }

    return null;
  } catch (error) {
    console.error('Error determining file type:', error);
    return null;
  }
};

// Hàm chuyển đổi text PDF sang HTML
const convertPdfToHtml = (text) => {
  try {
    // Chia text thành các đoạn
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    // Tạo HTML
    const html = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');
    
    return html;
  } catch (error) {
    console.error('Error converting PDF to HTML:', error);
    return '<p>Error converting PDF content</p>';
  }
};

module.exports = {
  getChapterContent,
};
