// src/components/common/SearchBar.jsx
import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search...", className = "" }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className={`search-bar ${className}`}>
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="search-clear"
          >
            ✕
          </button>
        )}
        <button type="submit" className="search-button">
          🔍
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
