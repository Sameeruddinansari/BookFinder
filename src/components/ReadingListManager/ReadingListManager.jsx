import React, { useState } from 'react';
import BookCard from '../BookCard/BookCard';
import { useUserData } from '../../contexts/UserDataContext';
import './ReadingListManager.css';
import { FileOutput } from "lucide-react"

export default function ReadingListManager({ userData, onCreateList, onBookClick }) {
  const { exportReadingLists } = useUserData();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState(null);

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      onCreateList(newListName.trim());
      setNewListName('');
      setShowCreateForm(false);
    }
  };

  const readingListsArray = Object.values(userData.readingLists || {});

  return (
    <div className="reading-list-manager">
      <div className="reading-lists-header">
        <h2>My Reading Lists</h2>
        <div className="list-actions">
          <button
            className="create-list-btn"
            onClick={() => setShowCreateForm(true)}
          >
            + Create New List
          </button>
          <button
            className="export-btn"
            onClick={exportReadingLists}
          >
            <FileOutput /> Export Lists
          </button>
        </div>
      </div>

      {showCreateForm && (
        <form className="create-list-form" onSubmit={handleCreateList}>
          <input
            type="text"
            placeholder="List name..."
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            autoFocus
          />
          <div className="form-actions">
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowCreateForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="reading-lists-grid">
        {readingListsArray.map(list => (
          <div key={list.id} className="reading-list-card">
            <div className="list-header">
              <h3>{list.name}</h3>
              <span className="book-count">{list.books.length} books</span>
            </div>

            {list.books.length > 0 ? (
              <div className="list-preview">
                {list.books.slice(0, 3).map(book => (
                  <div key={book.key} className="preview-cover">
                    {book.cover_i ? (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                        alt={book.title}
                      />
                    ) : (
                      <div className="preview-no-cover">📖</div>
                    )}
                  </div>
                ))}
                {list.books.length > 3 && (
                  <div className="preview-more">+{list.books.length - 3}</div>
                )}
              </div>
            ) : (
              <div className="empty-list">
                <p>No books yet</p>
              </div>
            )}

            <button
              className="view-list-btn"
              onClick={() => setSelectedList(selectedList === list.id ? null : list.id)}
            >
              {selectedList === list.id ? 'Hide Books' : 'View Books'}
            </button>

            {selectedList === list.id && (
              <div className="list-books">
                {list.books.map(book => (
                  <BookCard
                    key={book.key}
                    book={book}
                    onClick={() => onBookClick(book)}
                    compact={true}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {readingListsArray.length === 0 && (
        <div className="no-lists">
          <p>No reading lists yet. Create your first list to organize your books!</p>
        </div>
      )}
    </div>
  );
}