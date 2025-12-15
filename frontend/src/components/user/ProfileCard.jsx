import React from "react";
import styles from "../../assets/css/components.css/user.css/ProfileCard.module.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

const ProfileCard = ({ user, onEdit, onChangePassword}) => {
  const avatarUrl = user.avatar
    ? user.avatar.startsWith('http') 
      ? user.avatar 
      : `${import.meta.env.VITE_BASE_URL}${user.avatar}`
    : "/default-avatar.png";
  return (
    <div className={styles.container}>
      <img
        src={avatarUrl}
        alt="Avatar"
        className={styles.avatar}
      />
      <h2 className={styles.name}>{user.name || "No name"}</h2>
      <p className={styles.email}>{user.email}</p>
      <p className={styles.role}>Role: {user.role}</p>
      <p className={styles.balance}>
        💰 Số dư: {user.balance?.toLocaleString()} VND
      </p>
      <div className={styles.actions}>
        <button
          className={styles.button}
          onClick={onEdit}
        >
          Chỉnh sửa
        </button>
        <button
            className={styles.button}
            onClick={onChangePassword}
          >
            Đổi mật khẩu
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
