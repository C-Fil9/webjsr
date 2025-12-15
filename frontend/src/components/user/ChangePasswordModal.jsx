import React, { useState } from "react";
import axios from "axios";
import styles from "../../assets/css/components.css/user.css/ChangePasswordModal.module.css";

export default function ChangePasswordModal({ onClose }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      await axios.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      setMessage("Đổi mật khẩu thành công!");
      onClose(); // Đóng modal sau khi đổi mật khẩu thành công
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(
        "Lỗi: " + (err.response?.data?.message || "Không đổi được mật khẩu.")
      );
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Mật khẩu hiện tại"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            required
          />
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.confirmBtn}>
              Xác nhận
            </button>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
