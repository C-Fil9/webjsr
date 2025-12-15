import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../../assets/css/components.css/home.css/NewestBooks.module.css'; // Assuming you have a CSS module for styling

function NewestBooksSection() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('/books/admin/books')
      .then(res => {
        const sorted = res.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setBooks(sorted.slice(0, 10)); // Lấy 10 truyện mới
      });
  }, []);

  return (
    <section className={styles.sectionWrapper}>
      <h2 className={styles.sectionTitle}> Truyện mới cập nhật</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tên truyện</th>
              <th>Thể loại</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book._id}>
                <td><Link to={`/book/${book._id}`}>{book.title}</Link></td>
                <td>{book.category?.name || 'Không rõ'}</td>
                <td>{new Date(book.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default NewestBooksSection;
