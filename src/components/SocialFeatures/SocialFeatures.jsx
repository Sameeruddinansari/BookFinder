
import React, { useState } from 'react';
import { useUserData } from '../../contexts/UserDataContext';
import './SocialFeatures.css';
import { Facebook, Linkedin, TwitchIcon, BookCopy, MessagesSquare, Share2, BookOpenCheck, Users, Star, BookOpenText } from 'lucide-react';

export default function SocialFeatures({ book }) {
  const { userData, addToDiscussion, getDiscussions } = useUserData();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showDiscussion, setShowDiscussion] = useState(false);
  const [newComment, setNewComment] = useState('');

  const shareOnSocial = (platform) => {
    const text = `Currently reading "${book.title}" ${book.author_name ? `by ${book.author_name[0]}` : ''}`;
    const url = window.location.href;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const copyToClipboard = () => {
    const text = `Check out "${book.title}" ${book.author_name ? `by ${book.author_name[0]}` : ''} - ${window.location.href}`;
    navigator.clipboard.writeText(text);
    setShowShareMenu(false);
    // You could add a toast notification here
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addToDiscussion(book.key, {
        comment: newComment,
        timestamp: new Date().toISOString(),
        user: userData.profile?.name || 'Anonymous'
      });
      setNewComment('');
    }
  };

  const discussions = getDiscussions(book.key) || [];

  return (
    <div className="social-features">
      <div className="social-actions">
        <div className="share-section">
          <button
            className="share-btn"
            onClick={() => setShowShareMenu(!showShareMenu)}
          >
            <Share2 />Share Book
          </button>

          {showShareMenu && (
            <div className="share-menu">
              <button onClick={() => shareOnSocial('twitter')}>
                <TwitchIcon size={15} /> Twitter
              </button>
              <button onClick={() => shareOnSocial('facebook')}>
                <Facebook size={15} /> Facebook
              </button>
              <button onClick={() => shareOnSocial('linkedin')}>
                <Linkedin size={15} /> LinkedIn
              </button>
              <button onClick={copyToClipboard}>
                <BookCopy size={15} /> Copy Link
              </button>
            </div>
          )}
        </div>

        <button
          className="discussion-btn"
          onClick={() => setShowDiscussion(!showDiscussion)}
        >
          <MessagesSquare /> Discussion ({discussions.length})
        </button>
      </div>

      {showDiscussion && (
        <div className="discussion-panel">
          <h4>Book Discussion</h4>

          <div className="add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this book..."
              rows="3"
            />
            <button onClick={handleAddComment} disabled={!newComment.trim()}>
              Post Comment
            </button>
          </div>

          <div className="comments-list">
            {discussions.length === 0 ? (
              <p className="no-comments">No discussions yet. Be the first to share your thoughts!</p>
            ) : (
              discussions.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-header">
                    <strong>{comment.user}</strong>
                    <span className="comment-date">
                      {new Date(comment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="reading-activity">
        <h4>📖 Reading Activity</h4>
        <div className="activity-feed">
          <div className="activity-item">
            <span className="activity-icon"><Users size={16} StrokeWidth={3} /></span>
            <span>You saved this book to your reading list</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon"><Star size={16} StrokeWidth={3} /></span>
            <span>5 people rated this book this week</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon"><BookOpenText size={16} StrokeWidth={3} /></span>
            <span>Added to 12 reading lists recently</span>
          </div>
        </div>
      </div>
    </div>
  );
}
