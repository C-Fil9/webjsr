import React, { useState } from 'react';
import Sidebar from '../BarDesign/SideBar';
import Header from '../Header/Header';
import AdminHeader from '../Header/AdminHeader';
import Footer from '../Footer/Footer';
import styles from '../../assets/css/components.css/bardesign.css/sidebar.module.css';

function Layout({ children, userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={styles.wrapper}>
      {userRole === 'admin' && (
        <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      )}

      <div className={`${styles.content} ${isOpen ? styles.contentShift : ''}`}>
        {userRole === 'admin' ? (
          <AdminHeader toggleSidebar={toggleSidebar} />
        ) : (
          <Header />
        )}

        <main className={styles.mainContent}>
          {children}
          {userRole !== 'admin' &&  <Footer />}
        </main>
      </div>
    </div>
  );
}

export default Layout;
