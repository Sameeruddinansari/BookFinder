
import React, { useState } from 'react';
import './AdvancedFilters.css';

export default function AdvancedFilters({ onFiltersChange, isVisible, onToggle }) {
  const [filters, setFilters] = useState({
    yearFrom: '',
    yearTo: '',
    language: '',
    hasSubject: '',
    sortBy: 'relevance'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      yearFrom: '',
      yearTo: '',
      language: '',
      hasSubject: '',
      sortBy: 'relevance'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className={`advanced-filters ${isVisible ? 'visible' : ''}`}>
      <div className="filters-header">
        <h3>Advanced Filters</h3>
        <button className="toggle-filters" onClick={onToggle}>
          {isVisible ? '−' : '+'}
        </button>
      </div>

      {isVisible && (
        <div className="filters-content">
          <div className="filter-group">
            <label>Publication Year Range</label>
            <div className="year-range">
              <input
                type="number"
                placeholder="From"
                value={filters.yearFrom}
                onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                min="1000"
                max="2024"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="To"
                value={filters.yearTo}
                onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                min="1000"
                max="2024"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Language</label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="">All Languages</option>
              <option value="eng">English</option>
              <option value="spa">Spanish</option>
              <option value="fra">French</option>
              <option value="ger">German</option>
              <option value="ita">Italian</option>
              <option value="por">Portuguese</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Genre/Subject</label>
            <select
              value={filters.hasSubject}
              onChange={(e) => handleFilterChange('hasSubject', e.target.value)}
            >
              <option value="">All Genres</option>
              <option value="fiction">Fiction</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="biography">Biography</option>
              <option value="children">Children's Books</option>
              <option value="mystery">Mystery</option>
              <option value="romance">Romance</option>
              <option value="fantasy">Fantasy</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="new">Newest First</option>
              <option value="old">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <button className="clear-filters" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
