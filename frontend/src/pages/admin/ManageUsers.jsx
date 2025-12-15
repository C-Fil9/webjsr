import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../../assets/css/page.css/admin.css/userManager.module.css'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'


function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBalanceUserId, setEditingBalanceUserId] = useState(null);
  const [newBalance, setNewBalance] = useState('');


  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    }
  };

  const handleDeleteUser = async (userId) => {

    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      await axios.delete(`/users/admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      toast.success('Đã xóa người dùng');
      fetchUsers();
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Bạn không có quyền xóa người dùng');
      } else {
        toast.error('Lỗi khi xóa người dùng');
      }
      console.error(err);
    }
  };
  const getBalanceColor = (balance) => {
    if (balance < 0) return styles.color = 'red';
    return 'inherit';
  };
  const canDeleteUs = (balance) => {
    return balance >= 100000;
  };
  const handleUpdateRole = async (userId) => {
    try {
      await axios.patch(`/users/admin/users/${userId}`, { role: newRole });
      toast.success('Cập nhật quyền thành công');
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Bạn không có quyền cập nhật quyền người dùng');
      } else {
        toast.error('Lỗi khi cập nhật quyền');
      }
      console.error(err);
    }
  };

  const handleUpdateBalance = async (userId) => {
    try {
      await axios.patch(`/users/admin/users/${userId}/balance`, { amount: parseFloat(newBalance) });
      toast.success('Cập nhật số dư thành công');
      
     
      setEditingBalanceUserId(null);
      fetchUsers();
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Bạn không có quyền cập nhật số dư');
      } else {
        toast.error('Lỗi khi cập nhật số dư');
      }
      console.error(err);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <div className={styles.container}>
      <h2>Quản lý người dùng</h2>
      <input
        type="text"
        placeholder="Tìm kiếm người dùng theo tên..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Quyền</th>
            <th>Số dư</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.name || 'Chưa có tên'}</td>
              <td>{user.email}</td>
              <td>
                {editingUserId === user._id ? (
                  <>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button onClick={() => handleUpdateRole(user._id)}>Lưu</button>
                    <button onClick={() => setEditingUserId(null)}>Hủy</button>
                  </>
                ) : (
                  <>
                    {user.role}
                    <button
                      onClick={() => {
                        setEditingUserId(user._id);
                        setNewRole(user.role);
                      }}
                    >
                      Sửa
                    </button>
                  </>
                )}
              </td>
              <td>
                {editingBalanceUserId === user._id ? (
                  <>
                    <input
                      type="number"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                      placeholder="Số dư mới"
                    />
                    <button onClick={() => handleUpdateBalance(user._id)}>Lưu</button>
                    <button onClick={() => setEditingBalanceUserId(null)}>Hủy</button>
                  </>
                ) : (
                  <>
                    {user.balance}đ
                    <button
                      style={user.balance < 0 ? { color: 'white', backgroundColor: 'red' } : {}}
                      onClick={() => {
                        setEditingBalanceUserId(user._id);
                        setNewBalance(user.balance);
                      }}
                    >
                      Sửa
                    </button>
                  </>
                )}
              </td>
              <td>
                {user.balance <= 100000 && ( 
                  <button onClick={() => handleDeleteUser(user._id)}>Xóa</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ManageUsers
