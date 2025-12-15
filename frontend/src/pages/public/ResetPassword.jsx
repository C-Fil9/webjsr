import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from '../../assets/css/page.css/public.css/resetPassword.module.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/auth/reset-password/${token}`, { password });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Reset Password</h2>
      <div className={styles.inputGroup}>
        <label className={styles.label}>New Password</label>
        <input
          type="password"
          className={styles.input}
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" className={styles.button}>Reset</button>
    </form>
  );
}
