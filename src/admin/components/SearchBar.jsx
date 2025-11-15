import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ 
  onSearch, 
  onFilter, 
  filters = [], 
  placeholder = "Search...",
  showFilters = true 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilter(value);
    if (onFilter) {
      onFilter(value);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <button className="clear-search-btn" onClick={clearSearch}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="search-filters">
          <select 
            className="filter-select"
            value={selectedFilter}
            onChange={handleFilterChange}
          >
            <option value="">All</option>
            {filters.map((filter, index) => (
              <option key={index} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchBar;