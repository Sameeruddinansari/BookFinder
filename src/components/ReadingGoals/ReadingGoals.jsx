
import React, { useState } from 'react';
import { useUserData } from '../../contexts/UserDataContext';
import './ReadingGoals.css';
import { Target, ChartNoAxesCombined } from "lucide-react"

export default function ReadingGoals() {
  const { userData, updateReadingGoals, getReadingStats } = useUserData();
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalType, setGoalType] = useState('yearly');
  const [targetBooks, setTargetBooks] = useState('');
  const [targetPages, setTargetPages] = useState('');

  const currentGoals = userData.readingGoals || {};
  const stats = getReadingStats();

  const handleSaveGoal = () => {
    const goal = {
      type: goalType,
      targetBooks: parseInt(targetBooks) || 0,
      targetPages: parseInt(targetPages) || 0,
      startDate: new Date().toISOString(),
      year: new Date().getFullYear()
    };

    updateReadingGoals(goal);
    setShowGoalForm(false);
    setTargetBooks('');
    setTargetPages('');
  };

  const calculateProgress = (target, current) => {
    if (!target) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const currentYearGoal = currentGoals[new Date().getFullYear()];

  return (
    <div className="reading-goals">
      <div className="goals-header">
        <h2><Target /> Reading Goals</h2>
        <button
          className="set-goal-btn"
          onClick={() => setShowGoalForm(true)}
        >
          Set New Goal
        </button>
      </div>

      {currentYearGoal && (
        <div className="current-goal">
          <h3>{new Date().getFullYear()} Reading Challenge</h3>

          {currentYearGoal.targetBooks > 0 && (
            <div className="goal-progress">
              <div className="progress-info">
                <span>Books Read</span>
                <span>{stats.booksCompleted} / {currentYearGoal.targetBooks}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${calculateProgress(currentYearGoal.targetBooks, stats.booksCompleted)}%`
                  }}
                ></div>
              </div>
              <div className="progress-percentage">
                {calculateProgress(currentYearGoal.targetBooks, stats.booksCompleted)}% Complete
              </div>
            </div>
          )}

          {currentYearGoal.targetPages > 0 && (
            <div className="goal-progress">
              <div className="progress-info">
                <span>Pages Read</span>
                <span>{stats.pagesRead} / {currentYearGoal.targetPages}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${calculateProgress(currentYearGoal.targetPages, stats.pagesRead)}%`
                  }}
                ></div>
              </div>
              <div className="progress-percentage">
                {calculateProgress(currentYearGoal.targetPages, stats.pagesRead)}% Complete
              </div>
            </div>
          )}
        </div>
      )}

      <div className="reading-stats">
        <h3><ChartNoAxesCombined />Reading Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{stats.booksCompleted}</div>
            <div className="stat-label">Books Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.booksReading}</div>
            <div className="stat-label">Currently Reading</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.pagesRead}</div>
            <div className="stat-label">Pages Read</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.averageRating.toFixed(1)}</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </div>

      {showGoalForm && (
        <div className="goal-form-overlay">
          <div className="goal-form">
            <h3>Set Reading Goal</h3>

            <div className="form-group">
              <label>Goal Type</label>
              <select value={goalType} onChange={(e) => setGoalType(e.target.value)}>
                <option value="yearly">Yearly Challenge</option>
                <option value="monthly">Monthly Goal</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target Books</label>
              <input
                type="number"
                value={targetBooks}
                onChange={(e) => setTargetBooks(e.target.value)}
                placeholder="e.g., 24"
              />
            </div>

            <div className="form-group">
              <label>Target Pages</label>
              <input
                type="number"
                value={targetPages}
                onChange={(e) => setTargetPages(e.target.value)}
                placeholder="e.g., 10000"
              />
            </div>

            <div className="form-actions">
              <button onClick={() => setShowGoalForm(false)}>Cancel</button>
              <button onClick={handleSaveGoal} className="primary">Save Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
