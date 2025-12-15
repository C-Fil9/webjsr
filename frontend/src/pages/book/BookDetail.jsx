import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../../assets/css/page.css/book.css/BookDetail.module.css';
import { UserContext } from '../../../context/userContext';

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/books/admin/books/${id}`, { withCredentials: true });
        setBook(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi fetch chi tiết sách:', error);
      }
    };

    fetchBook();
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để mua truyện.');
      return;
    }

    try {
      setBuying(true);
      const res = await axios.post(`/auth/buyed-book/${book._id}`, {}, { withCredentials: true });

      // Giả sử server trả về user mới đã cập nhật
      setUser(res.data.updatedUser);
      alert('Mua truyện thành công!');
      navigate(`/book/read/${book._id}`);
    } catch (error) {
      console.error('Lỗi khi mua truyện:', error);
      alert(error.response?.data?.message || 'Mua truyện thất bại!');
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <p>Đang tải dữ liệu sách...</p>;
  if (!book) return <p>Không tìm thấy sách.</p>;

  const alreadyBought = user?.purchasedBooks?.includes(book._id);
  const coverImage = book.coverImage
    ? (book.coverImage.startsWith('http') ? book.coverImage : `http://localhost:8000${book.coverImage}`)
    : 'https://via.placeholder.com/150x220?text=No+Image';

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <h1 className={styles.title}>{book.title}</h1>
        <div className={styles.bookImageWrapper}>
          <img
            src={coverImage}
            alt={book.title}
            className={styles.bookImage}
            onError={(e) => (e.target.src = 'https://via.placeholder.com/300x450?text=Image+Error')}
          />
        </div>
        <p className={styles.author}>Tác giả: <span>{book.author || 'Không rõ'}</span></p>
        <p className={styles.category}>Thể loại: <span>{book.category?.name || 'Chưa xác định'}</span></p>
        <p className={styles.views}>👁️ {book.views} lượt xem</p>

        <p className={`${styles.price} ${book.isPaid ? styles.pricePaid : styles.priceFree}`}>
          {book.isPaid
            ? (alreadyBought ? 'Đã mua' : `Giá: ${book.price.toLocaleString()} VNĐ`)
            : 'Miễn phí'}
        </p>

        {book.isPaid ? (
          alreadyBought ? (
            <button onClick={() => navigate(`/book/read/${book._id}`)} className={styles.actionButton}>
              Đọc truyện
            </button>
          ) : (
            <button onClick={handlePurchase} className={styles.actionButton} disabled={buying}>
              {buying ? 'Đang xử lý...' : 'Mua ngay'}
            </button>
          )
        ) : (
          <button onClick={() => navigate(`/book/read/${book._id}`)} className={styles.actionButton}>
            Đọc truyện
          </button>
        )}
      </div>

      <div className={styles.rightSection}>
        <h2 className={styles.descriptionTitle}>Mô tả</h2>
        <p className={styles.description}>{book.description || 'Không có mô tả.'}</p>
      </div>
    </div>
  );
}

export default BookDetail;
