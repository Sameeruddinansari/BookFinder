import React from 'react';
import './Sidebar.css';
import { LogIn } from "lucide-react";


export default function Sidebar({
  isOpen,
  searchHistory,
  onHistoryItemClick,
  onClearHistory,
  currentView,
  onViewChange,
  onToggleSidebar
}) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h2>📚 BookFinder</h2>
          <button className="close-btn" onClick={onToggleSidebar}>
            <LogIn size={20} />

          </button>
        </div>

        <p>Find your next favorite book  👇</p>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${currentView === 'search' ? 'active' : ''}`}
            onClick={() => onViewChange('search')}
          >
            <span className="nav-icon"><i className='bx bx-search'></i></span>
            <span>Search Books</span>
          </button>

          <button
            className={`nav-item ${currentView === 'recommendations' ? 'active' : ''}`}
            onClick={() => onViewChange('recommendations')}
          >
            <span className="nav-icon"><i className='bx bx-star'></i></span>
            <span>Recommendations</span>
          </button>

          <button
            className={`nav-item ${currentView === 'saved-books' ? 'active' : ''}`}
            onClick={() => onViewChange('saved-books')}
          >
            <span className="nav-icon"><i className='bx bx-bookmarks'></i></span>
            <span>Saved Books</span>
          </button>

          <button
            className={`nav-item ${currentView === 'reading-lists' ? 'active' : ''}`}
            onClick={() => onViewChange('reading-lists')}
          >
            <span className="nav-icon"><i className='bx bx-book'></i></span>
            <span>Reading Lists</span>
          </button>

          <button
            className={`nav-item ${currentView === 'reading-goals' ? 'active' : ''}`}
            onClick={() => onViewChange('reading-goals')}
          >
            <span className="nav-icon"><i className='bx bx-calendar-star'></i></span>
            <span>Reading Goals</span>
          </button>
        </nav>

        <div className="search-history">
          <div className="history-header">
            <h3>Search History</h3>
            {searchHistory.length > 0 && (
              <button className="clear-history" onClick={onClearHistory}>
                Clear
              </button>
            )}
          </div>

          <div className="history-list">
            {searchHistory.length === 0 ? (
              <p className="no-history">No search history yet</p>
            ) : (
              searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="history-item"
                  onClick={() => onHistoryItemClick(item)}
                >
                  <div className="history-type">{item.type}</div>
                  <div className="history-query">{item.query}</div>
                  <div className="history-date">{item.date}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}