import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../assets/css/components.css/bardesign.css/sidebar.module.css';
import { FaBars } from 'react-icons/fa';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {isOpen && (
            <button className={styles.menuButtonInside} onClick={toggleSidebar}>
            <FaBars />
            </button>
        )}
        <div className={styles.overlay} onClick={toggleSidebar}></div>
        <div className={styles.menu}>
            <a href="/admin/Stats">📊 Dashboard</a>
            <a href="/admin/ManageBooks">📚 Quản lý Sách</a>
            <a href="/admin/ManageUsers">👥 Người dùng</a>
            <a href="/admin/ManageCategories">📂 Danh mục</a>
            <a href="/admin/settings">⚙️ Cài đặt</a>
        </div>
    </div>
  );
}

export default Sidebar;
