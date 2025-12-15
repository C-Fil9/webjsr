import React, { useEffect } from 'react';
import styles from '../../assets/css/components.css/book.css/BookCart.module.css';
import { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../../context/userContext';
import { Link, useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:8000';

function BookCart({ book }) {
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const coverImageUrl = book.coverImage
    ? (book.coverImage.startsWith('http') ? book.coverImage : BASE_URL + book.coverImage)
    : 'https://cdn.pixabay.com/photo/2020/02/07/04/34/painting-4826066_1280.jpg'; // ảnh placeholder nếu không có ảnh

    console.log('book.coverImage:', book.coverImage);
    console.log('coverImageUrl:', coverImageUrl);
    const alreadyBought = user?.purchasedBooks?.includes(book._id);

    const handleBuy = async () => {
        if (!user) return toast.error('Bạn cần đăng nhập để mua truyện');
        if (alreadyBought) return toast('Bạn đã mua truyện này');

        try {
            setLoading(true);
            const res = await axios.post(`/auth/buyed-book/${book._id}`);
            toast.success('Mua thành công!');

            // Cập nhật lại user context
            setUser(prev => ({
                ...prev,
                balance: res.data.balance,
                purchasedBooks: [...prev.purchasedBooks, book._id],
            }));

            navigate(`/book/read/${book._id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi mua truyện');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.coverImageWrapper}>
                <img
                    src={coverImageUrl}
                    alt={book.title}
                    className={styles.coverImage}
                />
                <Link to={`/book/${book._id}`}>
                    <button className={styles.viewButton}>Xem thêm</button>
                </Link>
            </div>

            <h3 className={styles.title}>{book.title}</h3>
            <p className={styles.views}>👁️ {book.views || 0} lượt xem</p>
            <p className={`${styles.price} ${book.isPaid ? styles.pricePaid : styles.priceFree}`}>
            {book.isPaid ? (alreadyBought ? 'Đã mua' : `Giá: ${book.price.toLocaleString()} VNĐ`) : 'Miễn phí'}
            </p>
            <p className={styles.category}>Thể loại: {book.category?.name || 'Chưa xác định'}</p>

            {book.isPaid ? (
            alreadyBought ? (
                <Link to={`/book/read/${book._id}`}>
                <button className={styles.buyButton}>Đọc Ngay</button>
                </Link>
            ) : (
                <button
                className={styles.buyButton}
                onClick={handleBuy}
                disabled={loading}
                >
                {loading ? 'Đang xử lý...' : 'Mua ngay'}
                </button>
            )
            ) : (
            <Link to={`/book/read/${book._id}`}>
                <button className={styles.buyButton}>Đọc Ngay</button>
            </Link>
            )}
        </div>
    );
}

export default BookCart;
