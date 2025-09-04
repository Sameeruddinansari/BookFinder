
import React from 'react';
import BookCard from '../BookCard/BookCard';
import './BookGrid.css';

export default function BookGrid({ books, onBookClick }) {
  return (
    <div className="book-grid">
      <div className="results-count">
        Found {books.length} book{books.length !== 1 ? 's' : ''}
      </div>
      <div className="grid">
        {books.map((book, index) => (
          <BookCard
            key={book.key || index}
            book={book}
            onClick={() => onBookClick && onBookClick(book)}
          />
        ))}
      </div>
    </div>
  );
}
