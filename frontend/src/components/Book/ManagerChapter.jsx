import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/css/components.css/book.css/chaptermanager.module.css';
import { toast } from 'react-hot-toast';

function ManagerChapter({ bookId, bookTitle, onBack }) {
  const [chapters, setChapters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    chapterNumber: '',
    title: '',
    content: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChapters = async () => {
    try {
      const res = await axios.get(`/chapters/${bookId}`);
      setChapters(res.data);
    } catch (err) {
      console.error('Error fetching chapters:', err);
      setError('Không thể tải danh sách chapters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchChapters();
    }
  }, [bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      content: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('chapter', formData.content);
      form.append('chapterNumber', formData.chapterNumber);
      form.append('title', formData.title);
      form.append('bookId', bookId);

      const res = await axios.post('/chapters/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setChapters(prev => [...prev, res.data.chapter]);
      toast.success('Thêm chapter thành công');
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error('Thêm chapter thất bại');
    }
  };

  const handleDelete = async (chapterId) => {
    // Debug log để kiểm tra chapterId
    console.log('Chapter to delete:', chapterId);

    if (!chapterId) {
      console.error('Chapter ID is undefined');
      toast.error('Không thể xác định chapter cần xóa');
      return;
    }

    if (!window.confirm('Bạn có chắc chắn muốn xóa chapter này?')) {
      return;
    }

    try {
      // Debug log để kiểm tra URL
      const deleteUrl = `/chapters/${chapterId}`;
      console.log('Delete URL:', deleteUrl);

      const response = await axios.delete(deleteUrl);
      console.log('Delete response:', response.data);
      
      toast.success('Đã xóa chapter');
      setChapters(prevChapters => prevChapters.filter(chapter => chapter._id !== chapterId));
    } catch (err) {
      console.error('Lỗi khi xóa chapter:', err);
      toast.error(err.response?.data?.message || 'Không thể xóa chapter');
    }
  };

  const resetForm = () => {
    setFormData({
      chapterNumber: '',
      title: '',
      content: null
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backButton}>
          Quay lại
        </button>
        <h2>Quản lý Chapters - {bookTitle}</h2>
      </div>

      <button 
        className={styles.addButton} 
        onClick={() => setShowModal(true)}
      >
        + Thêm Chapter
      </button>

      <table className={styles.chapterTable}>
        <thead>
          <tr>
            <th>Số Chapter</th>
            <th>Tiêu đề</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {chapters.map((chapter) => (
            <tr key={chapter._id}>
              <td>{chapter.chapterNumber}</td>
              <td>{chapter.title}</td>
              <td>
                <button
                  onClick={() => {
                    // Debug log để kiểm tra chapter object
                    console.log('Chapter object:', chapter);
                    handleDelete(chapter._id);
                  }}
                  className={styles.deleteButton}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Thêm Chapter mới</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                name="chapterNumber"
                placeholder="Số Chapter"
                value={formData.chapterNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Tiêu đề Chapter"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <input
                type="file"
                onChange={handleFileChange}
                required
              />
              <div className={styles.buttonGroup}>
                <button type="submit">Thêm</button>
                <button type="button" onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}>
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerChapter;