import React from "react";
import styles from "../../assets/css/components.css/user.css/PurchasedBookList.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

const PurchasedBookList = ({ books }) => {
  if (!books || books.length === 0) {
    return <p className={styles.empty}>Chưa mua truyện nào.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>📚 Truyện đã mua</h3>
      <div className={styles.grid}>
        {books.map((book) => (
          <div key={book.id} className={styles.card}>
            <img src={baseUrl + book.cover} alt={book.title} />
            <p>{book.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasedBookList;
