import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {useNavigate} from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import styles from '../../assets/css/page.css/public.css/login.module.css'
import { useContext } from 'react'
import { UserContext } from '../../../context/userContext'

export default function Login() {
  const Navigate = useNavigate()
  const { setUser } = useContext(UserContext)
  const [data, setData] = useState({
    email: '',
    password: ''
  })

const loginUser = async (e) => {
  e.preventDefault();
  const { email, password } = data;

  try {
    const res = await axios.post('/auth/login', { email, password });
    if (res.data.error) {
      toast.error(res.data.error);
      return;
    }
    // Gọi /profile để lấy đầy đủ thông tin user (bao gồm purchasedBooks)
    const profileRes = await axios.get('/auth/profile');
    setUser(profileRes.data);

    setData({ email: '', password: '' });
    toast.success('Đăng nhập thành công');

    if (profileRes.data.role === 'admin') {
      Navigate('/admin');
    } else {
      Navigate('/');
    }
  } catch (error) {
    toast.error('Lỗi khi đăng nhập');
  }
};

  return (
    <form className={styles.form} onSubmit={loginUser}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>
      <h2 className={styles.title}>Login</h2>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="email">Email</label>
        <input
          className={styles.input}
          type="email"
          id="email"
          name="email"
          placeholder="enter email ..."
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="password">Password</label>
        <input
          className={styles.input}
          type="password"
          id="password"
          name="password"
          placeholder="enter password ..."
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
      </div>
      <button className={styles.button} type="submit">Login</button>
      <div style={{ marginTop: '10px', textAlign: 'right' }}>
        <Link to="/forgot-password" style={{ color: '#007bff', textDecoration: 'none' }}>
          Quên mật khẩu?
        </Link>
      </div>
    </form>
  )
}
