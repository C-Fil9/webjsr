import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  return (
    <SearchContext.Provider value={{
      searchTerm,
      setSearchTerm,
      categoryId,
      setCategoryId,
      filteredBooks,
      setFilteredBooks,
    }}>
      {children}
    </SearchContext.Provider>
  );
};
