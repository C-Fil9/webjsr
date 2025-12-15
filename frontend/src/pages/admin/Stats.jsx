import React from 'react'
import styles from "../../assets/css/page.css/admin.css/stats.module.css"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

function Stats() {
    const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalCategories: 0,
  });

  useEffect(() => {
    // Gọi API để lấy thông tin thống kê
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/stats/admin/stats');
        setStats(data);
      } catch (error) {
        console.log('Error fetching stats:', error);
        toast.error('Không thể lấy thống kê');
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      {/* <AdminHeader /> */}
      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <span className={styles.statTitle}>Total Books</span>
          <span className={styles.statValue}>{stats.totalBooks}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statTitle}>Total Users</span>
          <span className={styles.statValue}>{stats.totalUsers}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statTitle}>Total Categories</span>
          <span className={styles.statValue}>{stats.totalCategories}</span>
        </div>
      </div>
    </>
  )
}

export default Stats
