import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import styles from '../../assets/css/page.css/public.css/forgotPassword.module.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/auth/forgot-password', { email })
      if (data.error) toast.error(data.error)
      else toast.success(data.message)
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2 className={styles.title}>Forgot Password</h2>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Email</label>
        <input
          type="email"
          className={styles.input}
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button type="submit" className={styles.button}>Send Reset Link</button>
    </form>
  )
}
