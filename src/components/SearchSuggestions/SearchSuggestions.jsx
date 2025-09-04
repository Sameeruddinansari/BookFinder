
import React, { useState, useEffect } from 'react';
import './SearchSuggestions.css';

export default function SearchSuggestions({ query, searchType, onSuggestionClick, isVisible }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2 || !isVisible) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        let url = '';
        switch (searchType) {
          case 'title':
            url = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=5`;
            break;
          case 'author':
            url = `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}&limit=5`;
            break;
          case 'subject':
            url = `https://openlibrary.org/search.json?subject=${encodeURIComponent(query)}&limit=5`;
            break;
          default:
            url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const uniqueSuggestions = [];

          data.docs?.forEach(book => {
            let suggestionText = '';
            switch (searchType) {
              case 'title':
                suggestionText = book.title;
                break;
              case 'author':
                suggestionText = book.author_name?.[0] || book.title;
                break;
              case 'subject':
                suggestionText = book.subject?.[0] || book.title;
                break;
              default:
                suggestionText = book.title;
            }

            if (suggestionText && !uniqueSuggestions.includes(suggestionText)) {
              uniqueSuggestions.push(suggestionText);
            }
          });

          setSuggestions(uniqueSuggestions.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query, searchType, isVisible]);

  if (!isVisible || (!loading && suggestions.length === 0)) {
    return null;
  }

  return (
    <div className="search-suggestions">
      {loading ? (
        <div className="suggestion-loading">Loading suggestions...</div>
      ) : (
        suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="suggestion-item"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <span className="suggestion-icon"><i class='bx bx-search'></i></span>
            <span className="suggestion-text">{suggestion}</span>
          </div>
        ))
      )}
    </div>
  );
}
