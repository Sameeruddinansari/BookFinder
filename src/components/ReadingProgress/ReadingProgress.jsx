
import React, { useState } from 'react';
import './ReadingProgress.css';
import { ChartSpline } from "lucide-react"

export default function ReadingProgress({ bookKey, progress, onUpdateProgress }) {
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(progress?.currentPage || 0);
  const [totalPages, setTotalPages] = useState(progress?.totalPages || 0);
  const [status, setStatus] = useState(progress?.status || 'want-to-read');

  const handleSave = () => {
    const percentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
    onUpdateProgress(bookKey, {
      currentPage: parseInt(currentPage),
      totalPages: parseInt(totalPages),
      percentage,
      status
    });
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reading': return '#4f9cf9';
      case 'completed': return '#48bb78';
      case 'want-to-read': return '#ed8936';
      case 'paused': return '#a0aec0';
      default: return '#a0aec0';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'reading': return 'Currently Reading';
      case 'completed': return 'Completed';
      case 'want-to-read': return 'Want to Read';
      case 'paused': return 'Paused';
      default: return 'Not Started';
    }
  };

  return (
    <div className="reading-progress">
      <div className="progress-header">
        <div className="status-indicator" style={{ backgroundColor: getStatusColor(status) }}>
          <span className="status-text">{getStatusText(status)}</span>
        </div>
        <button
          className="update-progress-btn"
          onClick={() => setShowForm(!showForm)}
        >
          <ChartSpline size={20} />Update Progress
        </button>
      </div>

      {progress && progress.totalPages > 0 && (
        <div className="progress-visual">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {progress.currentPage} / {progress.totalPages} pages ({progress.percentage}%)
          </div>
        </div>
      )}

      {showForm && (
        <div className="progress-form">
          <div className="form-row">
            <label>Reading Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="want-to-read">Want to Read</option>
              <option value="reading">Currently Reading</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-row">
            <label>Current Page:</label>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value)}
              min="0"
            />
          </div>

          <div className="form-row">
            <label>Total Pages:</label>
            <input
              type="number"
              value={totalPages}
              onChange={(e) => setTotalPages(e.target.value)}
              min="1"
            />
          </div>

          <div className="form-actions">
            <button onClick={handleSave}>Save Progress</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
