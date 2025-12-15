import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileCard from "../../components/user/ProfileCard";
import EditProfileModal from "../../components/user/EditProfileModal";
import ChangePasswordModal from "../../components/user/ChangePasswordModal";
import BookCard from "../../components/book/BookCart"; // Hiển thị sách đã mua
import styles from "../../assets/css/page.css/public.css/profile.module.css"; // Thêm CSS cho trang profile

const Profile = () => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' hoặc 'books'

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/auth/profile", { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin user: ", err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get("/auth/purchased-books", { withCredentials: true });
      setBooks(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách sách: ", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchBooks();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.tabMenu}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "profile" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Thông tin cá nhân
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === "books" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("books")}
        >
          Sách đã mua
        </button>
      </div>

      {activeTab === "profile" && user && (
        <>
          <ProfileCard
            user={user}
            onEdit={() => setShowEditModal(true)}
            onChangePassword={() => setShowPasswordModal(true)}
          />
          {showEditModal && (
            <EditProfileModal
              user={user}
              onClose={() => setShowEditModal(false)}
              onUpdate={fetchProfile}
            />
          )}
          {showPasswordModal && (
            <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
          )}
        </>
      )}

      {activeTab === "books" && (
        <div className={styles.booksGrid}>
          {books.length > 0 ? (
            books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))
          ) : (
            <p>Chưa có sách nào được mua.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
