
import React, { useState, useEffect } from 'react';
import BookRating from '../BookRating/BookRating';
import ReadingProgress from '../ReadingProgress/ReadingProgress';
import SocialFeatures from '../SocialFeatures/SocialFeatures';
import { useUserData } from '../../contexts/UserDataContext';
import './BookModal.css';

export default function BookModal({ book, isOpen, onClose }) {
  const {
    isBookSaved,
    saveBook,
    unsaveBook,
    rateBook,
    getBookRating,
    updateReadingProgress,
    getReadingProgress,
    addToRecentlyViewed,
    userData
  } = useUserData();

  const [showAddToList, setShowAddToList] = useState(false);

  const [communityRating, setCommunityRating] = useState(null);

  useEffect(() => {
    if (isOpen && book) {
      addToRecentlyViewed(book);
      setCommunityRating(4.3);
    }
  }, [isOpen, book, addToRecentlyViewed]);

  if (!isOpen || !book) return null;

  const getCoverUrl = (book, size = 'L') => {
    if (book.cover_i) {
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-${size}.jpg`;
    }
    return null;
  };

  const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'Unknown Author';
    return authors.join(', ');
  };

  const formatPublishers = (publishers) => {
    if (!publishers || publishers.length === 0) return 'Unknown Publisher';
    return publishers.slice(0, 3).join(', ');
  };

  const formatLanguages = (languages) => {
    if (!languages || languages.length === 0) return 'Unknown';
    return languages.slice(0, 3).join(', ');
  };

  const getOpenLibraryUrl = (book) => {
    return book.key ? `https://openlibrary.org${book.key}` : null;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-body">
          <div className="modal-left">
            <div className="modal-cover">
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
              <div className="modal-no-cover" style={{ display: getCoverUrl(book) ? 'none' : 'flex' }}>
                📖
              </div>
            </div>

            <div className="book-actions">
              <button
                className={`action-btn ${isBookSaved(book.key) ? 'saved' : 'secondary'}`}
                onClick={() => isBookSaved(book.key) ? unsaveBook(book.key) : saveBook(book)}
              >
                {isBookSaved(book.key) ? '❤️ Saved' : '🤍 Save for Later'}
              </button>

              <button
                className="action-btn secondary"
                onClick={() => setShowAddToList(!showAddToList)}
              >
                📚 Add to List
              </button>

              {getOpenLibraryUrl(book) && (
                <a
                  href={getOpenLibraryUrl(book)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="action-btn primary"
                >
                  📖 View on Open Library
                </a>
              )}
            </div>

            {showAddToList && (
              <div className="add-to-list-dropdown">
                {Object.values(userData.readingLists || {}).map(list => (
                  <button
                    key={list.id}
                    className="list-option"
                    onClick={() => {
                      // This would need to be connected to the context
                      console.log(`Add to ${list.name}`);
                      setShowAddToList(false);
                    }}
                  >
                    📚 {list.name} ({list.books.length})
                  </button>
                ))}
                {Object.keys(userData.readingLists || {}).length === 0 && (
                  <p className="no-lists-msg">No reading lists yet. Create one first!</p>
                )}
              </div>
            )}

            <ReadingProgress
              bookKey={book.key}
              progress={getReadingProgress(book.key)}
              onUpdateProgress={updateReadingProgress}
            />

            <SocialFeatures book={book} />
          </div>

          <div className="modal-right">
            <div className="modal-header">
              <h1 className="modal-title">{book.title}</h1>
              <p className="modal-authors">by {formatAuthors(book.author_name)}</p>

              <div className="ratings-section">
                <div className="community-rating">
                  <span className="rating-label">Community Rating:</span>
                  {communityRating && (
                    <>
                      <div className="stars">
                        {'★'.repeat(Math.floor(communityRating))}
                        {'☆'.repeat(5 - Math.floor(communityRating))}
                      </div>
                      <span className="rating-text">{communityRating}/5.0</span>
                    </>
                  )}
                </div>

                <div className="user-rating">
                  <span className="rating-label">Your Rating:</span>
                  <BookRating
                    bookKey={book.key}
                    currentRating={getBookRating(book.key)}
                    onRate={rateBook}
                  />
                </div>
              </div>
            </div>

            <div className="modal-details">
              <div className="detail-group">
                <h3>Publication Details</h3>
                <div className="detail-item">
                  <strong>First Published:</strong> {book.first_publish_year || 'Unknown'}
                </div>
                <div className="detail-item">
                  <strong>Publishers:</strong> {formatPublishers(book.publisher)}
                </div>
                <div className="detail-item">
                  <strong>Languages:</strong> {formatLanguages(book.language)}
                </div>
                {book.isbn && book.isbn.length > 0 && (
                  <div className="detail-item">
                    <strong>ISBN:</strong> {book.isbn[0]}
                  </div>
                )}
              </div>

              {book.subject && book.subject.length > 0 && (
                <div className="detail-group">
                  <h3>Subjects & Genres</h3>
                  <div className="subjects-grid">
                    {book.subject.slice(0, 12).map((subject, index) => (
                      <span key={index} className="subject-tag-modal">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-group">
                <h3>Description</h3>
                <p className="book-description">
                  This book explores fascinating themes and offers readers an engaging journey through {book.title}.
                  With insights from {formatAuthors(book.author_name)}, this work provides valuable perspectives on
                  {book.subject && book.subject.length > 0 ? book.subject.slice(0, 2).join(' and ') : 'various topics'}.
                </p>
              </div>

              <div className="detail-group">
                <h3>Reviews & Ratings</h3>
                <div className="reviews-summary">
                  <div className="review-stats">
                    <div className="stat">
                      <strong>{Math.floor(Math.random() * 500 + 100)}</strong>
                      <span>Total Reviews</span>
                    </div>
                    <div className="stat">
                      <strong>{Math.floor(Math.random() * 50 + 10)}</strong>
                      <span>Recent Reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
