import { Link } from "react-router-dom";
import logo from '../../assets/images/logo.png'
import styles from '../../assets/css/components.css/header.css/header.module.css'
import { UserContext } from "../../../context/userContext"
import { useContext } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast"
import { FaBars } from "react-icons/fa";
import SearchBar from "../BarDesign/SearchBar";
import CategoryFilter from "../BarDesign/CategoryFilter";
import { SearchContext } from "../../../context/SearchContext";

export default function AdminHeader({ isSidebarOpen, toggleSidebar }) {
  const {user, setUser} = useContext(UserContext);
  const navigate = useNavigate();
  const { setSearchTerm, setCategoryId } = useContext(SearchContext);
  const handleLogout = async () => {
  try {
    const { data } = await axios.get('/auth/logout'); // Gọi đến backend xóa cookie
    setUser && setUser(null); // Xóa user ở frontend context (nếu có)
    toast.success(data.message || 'Đăng xuất thành công');
    navigate('/login'); // Chuyển hướng về login
  } catch (error) {
    console.log(error);
    toast.error('Có lỗi xảy ra khi đăng xuất');
  }
  };

  const handleSearch = (val) => {
    setSearchTerm(val);
    navigate('/');
  };

  const handleFilter = (id) => {
    setCategoryId(id);
    navigate('/');
  };

  const getAvatarUrl = (user) => {
    if (!user?.avatar) return "/default-avatar.png";
    return user.avatar.startsWith('http') 
      ? user.avatar 
      : `${import.meta.env.VITE_BASE_URL}${user.avatar}`;
  };

  return (
    <header className={styles.Header}>
      <div className={styles.groupheader}>
        {!isSidebarOpen && (
          <button className={styles.menuButton} onClick={toggleSidebar}>
            <FaBars />
          </button>
        )}
        <img onClick={() => navigate('/admin')} src={logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.h1}>Admin Page</h1>
      </div>
      <div className={styles.searchAndFilter}>
        <div className={styles.searchBarWrapper}>
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className={styles.categoryFilterWrapper}>
          <CategoryFilter onFilter={handleFilter} />
        </div>
      </div>
      <nav className={styles.nav}>
        <div className={styles.navLinks}>
          <Link to="/" className={styles.link}>Home</Link>
          {user && (
            <Link to="/profile" className={styles.avatarLink}>
              <img
                src={getAvatarUrl(user)}
                alt="User Avatar"
                className={styles.avatar}
              />
            </Link>
          )}
          {user && <button onClick={handleLogout} className={styles.button}>Logout</button>}
        </div>
      </nav>
    </header>
  )
}


