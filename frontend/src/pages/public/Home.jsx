import React from 'react'
import HotComicsSection from '../../components/home/HotComicsSection'
import HotBooksSection from '../../components/home/HotBooksSection'
import NewestBooksSection from '../../components/home/NewestBooksSection'
import styles from '../../assets/css/page.css/public.css/home.module.css'
import BookCart from '../../components/Book/BookCart.jsx'
import { useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchContext } from '../../../context/SearchContext.jsx';
import axios from 'axios';


export default function Home() {
  const location = useLocation();
  const {
    searchTerm,
    categoryId,
    filteredBooks,
    setFilteredBooks,
  } = useContext(SearchContext);

  useEffect(() => {
  async function fetchBooks() {
    try {
      let url = '/books/admin/books'; // Mặc định lấy tất cả sách
      if (searchTerm && categoryId) {
        url = `/categories/admin/search-filter?title=${searchTerm}&categoryId=${categoryId}`;
      } else if (searchTerm) {
        url = `/books/admin/search?title=${searchTerm}`;
      } else if (categoryId) {
        url = `/books/admin/filter/${categoryId}`;
      }

      const res = await axios.get(url);
      setFilteredBooks(res.data);
    } catch (err) {
      console.error('Lỗi fetch sách:', err);
      setFilteredBooks([]);
    }
  }
  // Gọi fetch mỗi khi searchTerm hoặc categoryId thay đổi
  fetchBooks();
  }, [searchTerm, categoryId, location.pathname, setFilteredBooks]);

  return (
    <div className={styles.homeWrapper}>
      {(filteredBooks.length > 0 && (searchTerm || categoryId)) && (
        <div className={styles.resultSection}>
          <h2 className={styles.resultTitle}>Kết quả tìm kiếm / lọc</h2>
          <div className={styles.resultGrid}>
            {filteredBooks.map(book => (
              <BookCart key={book._id} book={book} />
            ))}
          </div>
        </div>
      )}
      <HotComicsSection />
      <HotBooksSection />
      <NewestBooksSection />
    </div>
  );  
}
