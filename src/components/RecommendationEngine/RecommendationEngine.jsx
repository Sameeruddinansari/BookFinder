
import React, { useState, useEffect } from 'react';
import BookCard from '../BookCard/BookCard';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { useUserData } from '../../contexts/UserDataContext';
import './RecommendationEngine.css';
import { Sparkles } from "lucide-react";

export default function RecommendationEngine({ onBookClick }) {
  const { userData, getRecentlyViewed } = useUserData();
  const [recommendations, setRecommendations] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPersonalizedContent();
  }, [userData]);

  const loadPersonalizedContent = async () => {
    setLoading(true);
    try {

      const recent = getRecentlyViewed();
      setRecentlyViewed(recent);

      const recs = await generateRecommendations();
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading personalized content:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    const { savedBooks, readingLists } = userData;
    const allUserBooks = [
      ...savedBooks,
      ...Object.values(readingLists).flatMap(list => list.books)
    ];

    if (allUserBooks.length === 0) {
      return await getPopularBooks();
    }

    const subjects = new Set();
    const authors = new Set();

    allUserBooks.forEach(book => {
      if (book.subject) {
        book.subject.slice(0, 100).forEach(s => subjects.add(s));
      }
      if (book.author_name) {
        book.author_name.slice(0, 100).forEach(a => authors.add(a));
      }
    });

    const recommendations = [];
    const subjectArray = Array.from(subjects).slice(0, 100);

    for (const subject of subjectArray) {
      try {
        const response = await fetch(
          `https://openlibrary.org/search.json?subject=${encodeURIComponent(subject)}&limit=5`
        );
        const data = await response.json();

        if (data.docs) {
          recommendations.push(...data.docs.filter(book =>
            !allUserBooks.some(userBook => userBook.key === book.key)
          ));
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }

    return recommendations.slice(0, 12);
  };

  const getPopularBooks = async () => {
    try {
      const response = await fetch(
        'https://openlibrary.org/search.json?q=bestseller&limit=12'
      );
      const data = await response.json();
      return data.docs || [];
    } catch (error) {
      console.error('Error fetching popular books:', error);
      return [];
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="recommendation-engine">
      {recentlyViewed.length > 0 && (
        <section className="recommendation-section">
          <h2>📚 Recently Viewed</h2>
          <div className="books-row">
            {recentlyViewed.slice(0, 6).map(book => (
              <BookCard
                key={book.key}
                book={book}
                onClick={() => onBookClick(book)}
                compact={true}
              />
            ))}
          </div>
        </section>
      )}

      <section className="recommendation-section">
        <h2><Sparkles size={22} /> Recommended for You</h2>
        {recommendations.length > 0 ? (
          <div className="books-row">
            {recommendations.map(book => (
              <BookCard
                key={book.key}
                book={book}
                onClick={() => onBookClick(book)}
                compact={true}
              />
            ))}
          </div>
        ) : (
          <div className="no-recommendations">
            <p>Save some books or create reading lists to get personalized recommendations!</p>
          </div>
        )}
      </section>
    </div>
  );
}
