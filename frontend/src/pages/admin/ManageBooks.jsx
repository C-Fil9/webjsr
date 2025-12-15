import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../assets/css/page.css/admin.css/bookManager.module.css';
import { toast } from 'react-hot-toast';
import SearchBar from '../../components/BarDesign/SearchBar';
import CategoryFilter from '../../components/BarDesign/CategoryFilter';
import ManageChapters from '../../components/Book/ManagerChapter';

function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [oldCoverImage, setOldCoverImage] = useState('');
  const [oldContentUrl, setOldContentUrl] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    chapterNumber: '',
    totalChapters: 0,
    description: '',
    type: 'sach',
    category: '',
    author: '',
    isPaid: false,
    price: 0,
    contentUrl: '',
    coverImage: ''
  });
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('/books/admin/books');
      setBooks(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách sách");
    }
  };


  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // hàm tải file lên thư mục upload nầm trên backend
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append(type === 'cover' ? 'cover' : 'content', file);

    try {
      const res = await axios.post(
        type === 'cover' ? '/upload/cover' : '/upload/content',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (res.data?.url) {
        setFormData(prev => ({
          ...prev,
          [type === 'cover' ? 'coverImage' : 'contentUrl']: res.data.url
        }));
        toast.success(`Tải ${type === 'cover' ? 'ảnh bìa' : 'nội dung'} thành công`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Tải ${type === 'cover' ? 'ảnh bìa' : 'nội dung'} thất bại`);
    }
  };

  // hàm thên sách
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        const res = await axios.patch(`/books/admin/books/${currentEditId}`, {
          ...formData,
          oldCoverImage,
          oldContentUrl,
        });
        setBooks(prev =>
          prev.map(book => book._id === currentEditId ? res.data : book)
        );
        toast.success("Cập nhật sách thành công");
      } else {
        const res = await axios.post('/books/admin/createbooks', formData);
        setBooks(prev => [...prev, res.data]);
        toast.success('Thêm sách thành công');
      }

      setShowModal(false);
      setIsEditMode(false);
      setCurrentEditId(null);
      resetForm();
    } catch (err) {
      console.error("Lỗi khi lưu sách:", err);
      toast.error(isEditMode ? "Cập nhật thất bại" : "Thêm sách thất bại");
    }
  };


  const handleCancel = async () => {
    try {
      if (!isEditMode) {
        if (formData.coverImage) {
          const publicId = formData.coverImage.split('/').pop().split('.')[0];
          await axios.delete('/upload/delete', { data: { publicId } });
        }
        if (formData.contentUrl) {
          const publicId = formData.contentUrl.split('/').pop().split('.')[0];
          await axios.delete('/upload/delete', { data: { publicId } });
        }
      }
    } catch (error) {
      console.error('Lỗi khi xóa file:', error);
      toast.error('Xóa file thất bại');
    }

    setShowModal(false);
    setIsEditMode(false);
    setCurrentEditId(null);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sách này?")) return;

    try {
      await axios.delete(`/books/${id}`);
      setBooks(prev => prev.filter(book => book._id !== id));
      toast.success("Xóa sách thành công");
    } catch (error) {
      console.error("Lỗi khi xóa sách:", error);
      toast.error("Xóa sách thất bại");
    }
  };

  // hàm reset form
  const resetForm = () => {
    setFormData({
      title: '',
      chapterNumber: '',
      totalChapters: 0,
      description: '',
      type: 'sach',
      category: '',
      author: '',
      isPaid: false,
      price: 0,
      contentUrl: '',
      coverImage: ''
    });
    setOldCoverImage('');
    setOldContentUrl('');
  };

  // hàm lọc 
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCategory = selectedCategory === '' || book.category?._id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.container}>
      {selectedBook ? (
        <ManageChapters 
          bookId={selectedBook._id} 
          bookTitle={selectedBook.title}
          onBack={() => setSelectedBook(null)}
        />
      ) : (
        <>
          <h2>Quản lý sách</h2>

          <div className={styles.searchAndFilter}>
            <button className={styles.addButton} onClick={() => {
              setIsEditMode(false);
              setShowModal(true);
                resetForm();
              }}>
                + Thêm sách
              </button>
              <div className={styles.searchBarWrapper}>
                <SearchBar onSearch={(keyword) => setSearchKeyword(keyword)} />
              </div>
              <div className={styles.categoryFilterWrapper}>
                <CategoryFilter onFilter={(categoryId) => setSelectedCategory(categoryId)} />
              </div>
              </div>
              <table className={styles.bookTable}>
              <thead>
                <tr>
                <th>Tiêu đề</th>
                <th>số chapter</th>

                <th>Thể loại</th>
                <th>Tác giả</th>
                <th>Trả phí</th>
                <th>Giá</th>
                <th>Loại</th>
                <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.totalChapters}</td>
                  <td>{book.category?.name || 'Không có'}</td>
                  <td>{book.author}</td>
                  <td>{book.isPaid ? 'Có' : 'Miễn phí'}</td>
                  <td>{book.price}</td>
                  <td>{book.type}</td>
                  <td>
                  <button
                    className={styles.editBtn}
                    onClick={() => {
                        setIsEditMode(true);
                        setCurrentEditId(book._id);
                        setOldCoverImage(book.coverImage);
                        setFormData({
                          title: book.title,
                          chapterNumber: book.chapters?.chapterNumber ||'',
                          description: book.description,
                          type: book.type,
                          category: book.category?._id || '',
                          author: book.author,
                          isPaid: book.isPaid,
                          price: book.price,
                          coverImage: book.coverImage
                        });
                        setShowModal(true);
                      }}
                    >
                      Sửa
                    </button>
                    <button 
                      className={styles.chapterBtn}
                      onClick={() => setSelectedBook(book)}
                    >
                      Quản lý Chapters
                    </button>
                    <button 
                      className={styles.deleteBtn} 
                      onClick={() => handleDelete(book._id)}
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <h3>{isEditMode ? 'Sửa sách' : 'Thêm sách mới'}</h3>
                <form onSubmit={handleSubmit}>
                  <input type="text" name="title" placeholder="Tiêu đề" value={formData.title} onChange={handleChange} required />
                  <input type="text" name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} />
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="sach">Sách</option>
                    <option value="truyen">Truyện</option>
                  </select>
                  <input type="text" name="category" placeholder="ID danh mục" value={formData.category} onChange={handleChange} />
                  <input type="text" name="author" placeholder="Tác giả" value={formData.author} onChange={handleChange} />
                  <label>
                    <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} />
                    Trả phí
                  </label>
                  {formData.isPaid && (
                    <input type="number" name="price" placeholder="Giá" value={formData.price} onChange={handleChange} />
                  )}

                  <label>Upload ảnh bìa</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} />
                  {formData.coverImage && <p className={styles.uploadedText}>Đã tải ảnh bìa: {formData.coverImage}</p>}

                  <div className={styles.modalActions}>
                    <button type="submit">Lưu</button>
                    <button type="button" onClick={handleCancel}>Hủy</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}


export default ManageBooks;
