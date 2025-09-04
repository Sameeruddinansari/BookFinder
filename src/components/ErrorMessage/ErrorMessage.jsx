
import React from 'react';
import './ErrorMessage.css';

export default function ErrorMessage({ message }) {
  return (
    <div className="error-message">
      <span className="error-icon">⚠️</span>
      <p>{message}</p>
    </div>
  );
}
