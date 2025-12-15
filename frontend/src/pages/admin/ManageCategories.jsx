import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../assets/css/page.css/admin.css/categoryManager.module.css';
import { toast } from 'react-hot-toast';

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/categories/admin/categories');
      setCategories(res.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.patch(`/categories/admin/categories/${editId}`, { name, description });
        toast.success('Cập nhật thể loại thành công');
      } else {
        await axios.post('/categories/admin/categories', { name, description });
        toast.success('Thêm thể loại thành công');
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleEdit = (category) => {
    setEditId(category._id);
    setName(category.name);
    setDescription(category.description);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá thể loại này không?')) return;
    try {
      await axios.delete(`/categories/admin/categories/${id}`);
      toast.success('Xoá thể loại thành công');
      fetchCategories();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xoá thể loại');
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const resetForm = () => {
    setEditId(null);
    setName('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className={styles.container}>
      <h2>Quản lý thể loại</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Tên thể loại"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Mô tả thể loại"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">{editId ? 'Cập nhật' : 'Thêm mới'}</button>
      </form>
      <input
        type="text"
        placeholder="Tìm kiếm thể loại theo tên..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên thể loại</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((c, i) => (
            <tr key={c._id}>
              <td>{i + 1}</td>
              <td>{c.name}</td>
              <td>{c.description}</td>
              <td>
                <button
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                  onClick={() => handleEdit(c)}
                >
                  Sửa
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => handleDelete(c._id)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Cập nhật thể loại</h3>
            <input
              type="text"
              placeholder="Tên thể loại"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Mô tả thể loại"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button className={styles.saveBtn} onClick={handleSubmit}>
                Lưu
              </button>
              <button className={styles.cancelBtn} onClick={resetForm}>
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCategories;
