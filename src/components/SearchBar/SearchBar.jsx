
import React, { useState, useRef, useEffect } from 'react';
import SearchSuggestions from '../SearchSuggestions/SearchSuggestions';
import './SearchBar.css';

export default function SearchBar({ onSearch, historySearch }) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const searchBarRef = useRef(null);

  // Effect to handle history searches
  useEffect(() => {
    if (historySearch && historySearch.query) {
      setQuery(historySearch.query);
      setSearchType(historySearch.type);
      onSearch(historySearch.query, historySearch.type);
    }
  }, [historySearch]);

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setInputFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(e.target.value.length > 1);
  };

  const handleInputFocus = () => {
    setInputFocused(true);
    setShowSuggestions(query.length > 1);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setInputFocused(false);
    onSearch(suggestion, searchType);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, searchType);
  };

  return (
    <div ref={searchBarRef} className="search-bar-container">
      <form className="search-bar" onSubmit={handleSubmit}>
        <div className="search-controls">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type"
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="subject">Subject</option>
            <option value="isbn">ISBN</option>
            <option value="general">General</option>
          </select>

          <div className="search-input-container">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              placeholder={`Search by ${searchType}...`}
              className="search-input"
              required
            />

            <SearchSuggestions
              query={query}
              searchType={searchType}
              onSuggestionClick={handleSuggestionClick}
              isVisible={showSuggestions && inputFocused}
            />
          </div>

          <button type="submit" className="search-button">
            <i class='bx bx-search'></i> Search
          </button>
        </div>
      </form>
    </div>
  );
}
