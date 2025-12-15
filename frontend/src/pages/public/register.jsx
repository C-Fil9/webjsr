import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import logo from '../../assets/images/logo.png'
import { useNavigate } from 'react-router-dom'
import styles from '../../assets/css/page.css/public.css/register.module.css'

export default function register() {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })


  const registerUser = async (e) => {
    e.preventDefault()
    const { name, email, password, confirmPassword } = data
    try {
      const {data} = await axios.post('/auth/register', { name, email, password, confirmPassword })
      if (data.error) {
        toast.error(data.error)
      }else {
        setData(data.user || null)
        setData({ name: '', email: '', password: '', confirmPassword: '' })
        toast.success('Register successful. Let`s Login!')
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <form onSubmit={registerUser} className={styles.registerForm}>
      <div>
        <img src={logo} alt="Logo" className={styles.logo} />
      </div>
      <h2 className={styles.title}>Register</h2>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input type="text" id="name" className={styles.input} name="name" placeholder='enter name ...' value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input type="email" id="email" className={styles.input} name="email" placeholder='enter email ...' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })}/>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>Password</label>
        <input type="password" id="password" className={styles.input} name="password" placeholder='enter password ...' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })}/>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
        <input type="password" id="confirmPassword" className={styles.input} name="confirmPassword" placeholder='confirm password ...' value={data.confirmPassword} onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}/>
      </div>
      <button type="submit" className={styles.button}>Register</button>
    </form>
  )
}
