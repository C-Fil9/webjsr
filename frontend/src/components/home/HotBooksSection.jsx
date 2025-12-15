import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import BookCart from '../Book/BookCart';
import styles from '../../assets/css/components.css/home.css/HotBooks.module.css'; // Assuming you have a CSS module for styling

function HotBooksSection() {
  const [books, setBooks] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    axios.get('/books/admin/books')
      .then(res => {
        const filtered = res.data
          .filter(book => book.type === 'sach')
          .slice(0, 6);
        setBooks(filtered);
      })
      .catch(err => console.error('Lỗi khi lấy sách hot:', err));
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -12330, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 1230, behavior: 'smooth' });
  };

  return (
    <section className={styles.sectionWrapper}>
      <h2 className={styles.sectionTitle}>SÁCH HOT</h2>
      <div className={styles.sliderContainer}>
        <button className={`${styles.arrowBtn} ${styles.left}`} onClick={scrollLeft}>
          &lt;
        </button>
        <div className={styles.sliderWrapper} ref={scrollRef}>
          {books.map(book => (
            <div className={styles.bookItem} key={book._id}>
              <BookCart book={book} />
            </div>
          ))}
        </div>
        <button className={`${styles.arrowBtn} ${styles.right}`} onClick={scrollRight}>
          &gt;
        </button>
      </div>
    </section>
  );
}

export default HotBooksSection;
