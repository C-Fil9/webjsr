import React from 'react'
import { Link } from "react-router-dom";
import AdminHeader from '../../components/Header/AdminHeader'
import styles from '../../assets/css/page.css/admin.css/adminDashboard.module.css'

export default function AdminDashboard() {
  return (
    <>
      <AdminHeader />
      <div className={styles.container}>
        <div className={styles.cardGrid}>
          <Link to="/admin/Stats" className={styles.card}>📊 Thống kê</Link>
          <Link to="/admin/ManageUsers" className={styles.card}>👥 Quản lý người dùng</Link>
          <Link to="/admin/ManageBooks" className={styles.card}>📚 Quản lý sách</Link>
          <Link to="/admin/ManageCategories" className={styles.card}>🗂️ Quản lý thể loại</Link>
        </div>
      </div>
    </>
  )
}
