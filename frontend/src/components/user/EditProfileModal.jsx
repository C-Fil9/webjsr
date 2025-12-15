import React, { useState } from "react";
import axios from "axios";
import styles from "../../assets/css/components.css/user.css/EditProfileModal.module.css";

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  const [name, setName] = useState(user.name || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user.avatar || "");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let avatarUrl = user.avatar;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        const res = await axios.post("/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        avatarUrl = res.data.url;
      }

      const updateRes = await axios.patch("/auth/update", { name, avatar: avatarUrl });
      onUpdate(updateRes.data);
      onClose();
    } catch (err) {
      console.error("Lỗi cập nhật: ", err);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <h2 className={styles.title}>Chỉnh sửa thông tin</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>
            <span>Ảnh đại diện</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className={styles.previewImage}
              />
            )}
          </label>

          <input
            type="text"
            className={styles.textInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên của bạn"
          />

          <div className={styles.buttonsWrapper}>
            <button type="button" onClick={onClose} className={styles.buttonCancel}>
              Hủy
            </button>
            <button type="submit" className={styles.buttonSave}>
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
