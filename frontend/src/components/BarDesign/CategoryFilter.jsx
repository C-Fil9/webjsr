import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CategoryFilter({ onFilter }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get('/categories/admin/categories'); // API lấy thể loại
        setCategories(res.data);
      } catch (err) {
        console.error('Lỗi lấy thể loại:', err);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    onFilter(e.target.value);
  };

  return (
    <select onChange={handleChange} defaultValue="">
      <option value="">-- Chọn thể loại --</option>
      {categories.map(cat => (
        <option key={cat._id} value={cat._id}>{cat.name}</option>
      ))}
    </select>
  );
}
