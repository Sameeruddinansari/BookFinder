import React, { useState, useEffect } from 'react';
import SearchBar from '../SearchBar/SearchBar';
import AdvancedFilters from '../AdvancedFilters/AdvancedFilters';
import BookGrid from '../BookGrid/BookGrid';
import BookModal from '../BookModal/BookModal';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { useUserData } from '../../contexts/UserDataContext';
import './BookFinder.css';

export default function BookFinder({ onSearch, historySearch }) {
  const { addToRecentlyViewed } = useUserData();
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const applyFiltersAndSort = (booksToFilter, currentFilters) => {
    let filtered = [...booksToFilter];

    if (currentFilters.yearFrom) {
      filtered = filtered.filter(book =>
        book.first_publish_year && book.first_publish_year >= parseInt(currentFilters.yearFrom)
      );
    }
    if (currentFilters.yearTo) {
      filtered = filtered.filter(book =>
        book.first_publish_year && book.first_publish_year <= parseInt(currentFilters.yearTo)
      );
    }

    if (currentFilters.language) {
      filtered = filtered.filter(book =>
        book.language && book.language.includes(currentFilters.language)
      );
    }

    if (currentFilters.hasSubject) {
      filtered = filtered.filter(book =>
        book.subject && book.subject.some(subject =>
          subject.toLowerCase().includes(currentFilters.hasSubject.toLowerCase())
        )
      );
    }

    switch (currentFilters.sortBy) {
      case 'new':
        filtered.sort((a, b) => (b.first_publish_year || 0) - (a.first_publish_year || 0));
        break;
      case 'old':
        filtered.sort((a, b) => (a.first_publish_year || 9999) - (b.first_publish_year || 9999));
        break;
      case 'title':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'rating':

        filtered.sort(() => Math.random() - 0.5);
        break;
      default:

        break;
    }

    return filtered;
  };

  useEffect(() => {
    searchBooks("programming", "title");
  }, []);


  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    const filtered = applyFiltersAndSort(allBooks, newFilters);
    setBooks(filtered);
  };

  const handleBookClick = (book) => {
    addToRecentlyViewed(book);
    setSelectedBook(book);
    setModalOpen(true);
  };

  const searchBooks = async (searchQuery, searchType) => {
    if (!searchQuery.trim()) return;

    onSearch(searchQuery, searchType);

    setLoading(true);
    setError('');
    setBooks([]);
    setAllBooks([]);

    try {
      let url = '';
      switch (searchType) {
        case 'title':
          url = `https://openlibrary.org/search.json?title=${encodeURIComponent(searchQuery)}&limit=50`;
          break;
        case 'author':
          url = `https://openlibrary.org/search.json?author=${encodeURIComponent(searchQuery)}&limit=50`;
          break;
        case 'subject':
          url = `https://openlibrary.org/search.json?subject=${encodeURIComponent(searchQuery)}&limit=50`;
          break;
        case 'isbn':
          url = `https://openlibrary.org/search.json?isbn=${encodeURIComponent(searchQuery)}&limit=50`;
          break;
        default:
          url = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=50`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await response.json();
      const fetchedBooks = data.docs || [];
      setAllBooks(fetchedBooks);

      const filtered = applyFiltersAndSort(fetchedBooks, filters);
      setBooks(filtered);
    } catch (err) {
      setError('Error searching for books. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-finder">
      <div className="page-header">
        <h1>📖 Discover your favorite books and unlock new worlds</h1>
        <p>Search millions of books and build your perfect reading collection</p>
      </div>
      <SearchBar onSearch={searchBooks} historySearch={historySearch} />

      <AdvancedFilters
        onFiltersChange={handleFiltersChange}
        isVisible={filtersVisible}
        onToggle={() => setFiltersVisible(!filtersVisible)}
      />

      {error && <ErrorMessage message={error} />}
      {loading && <LoadingSpinner />}
      {!loading && !error && books.length > 0 && (
        <BookGrid books={books} onBookClick={handleBookClick} />
      )}
      {!loading && !error && allBooks.length > 0 && books.length === 0 && (
        <div className="no-results">
          <p>No books match your current filters. Try adjusting the criteria.</p>
        </div>
      )}
      {!loading && !error && allBooks.length === 0 && (
        <div className="no-results">
          <p>Search for books by title, author, subject, or ISBN</p>
        </div>
      )}

      <BookModal
        book={selectedBook}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}