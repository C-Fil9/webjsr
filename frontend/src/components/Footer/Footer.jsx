    import React from "react";
import styles from "../../assets/css/components.css/Footer.css/Footer.module.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.logo}>
          <h2>📚 BookStore</h2>
          <p>Đọc truyện mọi lúc, mọi nơi.</p>
        </div>

        <div className={styles.links}>
          <a href="#">Giới thiệu</a>
          <a href="#">Điều khoản</a>
          <a href="#">Chính sách</a>
          <a href="#">Liên hệ</a>
        </div>

        <div className={styles.social}>
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaGithub /></a>
        </div>
      </div>
      <div className={styles.copyRight}>
        &copy; {new Date().getFullYear()} BookStore. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
