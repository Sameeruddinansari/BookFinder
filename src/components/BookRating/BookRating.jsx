
import React, { useState } from 'react';
import './BookRating.css';

export default function BookRating({ bookKey, currentRating, onRate, readonly = false }) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleRate = (rating) => {
    if (!readonly && onRate) {
      onRate(bookKey, rating);
    }
  };

  const displayRating = hoveredRating || currentRating;

  return (
    <div className="book-rating-component">
      <div className="stars-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star ${star <= displayRating ? 'filled' : ''} ${readonly ? 'readonly' : ''}`}
            onClick={() => handleRate(star)}
            onMouseEnter={() => !readonly && setHoveredRating(star)}
            onMouseLeave={() => !readonly && setHoveredRating(0)}
            disabled={readonly}
          >
            ★
          </button>
        ))}
      </div>
      {currentRating > 0 && (
        <span className="rating-text">{currentRating}/5</span>
      )}
    </div>
  );
}
