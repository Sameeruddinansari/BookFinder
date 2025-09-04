
import React from 'react';
import BookRating from '../BookRating/BookRating';
import { useUserData } from '../../contexts/UserDataContext';
import './BookCard.css';

export default function BookCard({ book, onClick, compact = false }) {
  const { isBookSaved, saveBook, unsaveBook, rateBook, getBookRating } = useUserData();
  const getCoverUrl = (book) => {
    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    }
    return null;
  };

  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'Unknown Author';
    return authors.slice(0, 2).join(', ') + (authors.length > 2 ? '...' : '');
  };

  const formatYear = (year) => {
    if (!year) return '';
    return Array.isArray(year) ? year[0] : year;
  };

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    if (isBookSaved(book.key)) {
      unsaveBook(book.key);
    } else {
      saveBook(book);
    }
  };

  const handleRating = (bookKey, rating) => {
    rateBook(bookKey, rating);
  };

  return (
    <div className={`book-card ${compact ? 'compact' : ''}`} onClick={onClick}>
      <div className="book-cover">
        {getCoverUrl(book) ? (
          <img
            src={getCoverUrl(book)}
            alt={book.title}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="no-cover" style={{ display: getCoverUrl(book) ? 'none' : 'flex' }}>
          📖
        </div>
      </div>

      <div className="book-info">
        <div className="book-header">
          <h3 className="book-title">{book.title}</h3>
          <button
            className={`save-btn ${isBookSaved(book.key) ? 'saved' : ''}`}
            onClick={handleSaveToggle}
            title={isBookSaved(book.key) ? 'Remove from saved' : 'Save for later'}
          >
            {isBookSaved(book.key) ? '❤️' : '❤️'}
          </button>
        </div>

        <p className="book-author">{formatAuthors(book.author_name)}</p>

        <BookRating
          bookKey={book.key}
          currentRating={getBookRating(book.key)}
          onRate={handleRating}
        />

        {book.first_publish_year && (
          <p className="book-year">Published: {formatYear(book.first_publish_year)}</p>
        )}

        {book.subject && book.subject.length > 0 && !compact && (
          <div className="book-subjects">
            {book.subject.slice(0, 3).map((subject, index) => (
              <span key={index} className="subject-tag">
                {subject}
              </span>
            ))}
          </div>
        )}

        {book.publisher && book.publisher.length > 0 && !compact && (
          <p className="book-publisher">
            Publisher: {book.publisher.slice(0, 2).join(', ')}
          </p>
        )}
      </div>
    </div>
  );
}
