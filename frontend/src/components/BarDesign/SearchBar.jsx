import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tìm kiếm truyện..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button type="submit">Tìm</button>
    </form>
  );
}
