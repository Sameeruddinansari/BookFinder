import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import BookFinder from './components/BookFinder/BookFinder';
import ReadingListManager from './components/ReadingListManager/ReadingListManager';
import RecommendationEngine from './components/RecommendationEngine/RecommendationEngine';
import ReadingGoals from './components/ReadingGoals/ReadingGoals';
import BookCard from './components/BookCard/BookCard';
import { UserDataProvider, useUserData } from './contexts/UserDataContext';
import './App.css';
import Footer from './components/Footer/Footer'
import 'boxicons/css/boxicons.min.css';


function AppContent() {
  const { userData, createReadingList, addToReadingList, removeFromReadingList } = useUserData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [currentView, setCurrentView] = useState('search');
  const [setSelectedBook] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: 'Alex',
    email: 'alex@example.com',
    photo: null
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('book-finder-theme');
    const savedHistory = localStorage.getItem('book-finder-history');
    const savedSidebarState = localStorage.getItem('book-finder-sidebar');
    const savedUserProfile = localStorage.getItem('book-finder-profile');

    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }

    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    if (savedSidebarState) {
      setSidebarOpen(JSON.parse(savedSidebarState));
    }

    if (savedUserProfile) {
      setUserProfile(JSON.parse(savedUserProfile));
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('book-finder-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);


  useEffect(() => {
    localStorage.setItem('book-finder-history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('book-finder-sidebar', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('book-finder-profile', JSON.stringify(userProfile));
  }, [userProfile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const addToSearchHistory = (query, type) => {
    const newHistoryItem = {
      query,
      type,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };

    setSearchHistory(prev => {
      const filtered = prev.filter(item =>
        !(item.query === query && item.type === type)
      );
      return [newHistoryItem, ...filtered].slice(0, 20);
    });
  };

  const handleHistorySearch = (historyItem) => {
    // This will be passed to BookFinder to trigger a search
    return historyItem;
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const updateUserProfile = (newProfile) => {
    setUserProfile(prev => ({ ...prev, ...newProfile }));
  };

  return (
    <div className={`app ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <TopBar
        onToggleSidebar={toggleSidebar}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        userProfile={userProfile}
        onUpdateProfile={updateUserProfile}
      />

      <Sidebar
        isOpen={sidebarOpen}
        searchHistory={searchHistory}
        onHistoryItemClick={handleHistorySearch}
        onClearHistory={clearSearchHistory}
        currentView={currentView}
        onViewChange={setCurrentView}
        onToggleSidebar={toggleSidebar}
      />

      <main className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {currentView === 'search' && (
          <BookFinder
            onSearch={addToSearchHistory}
            historySearch={handleHistorySearch}
          />
        )}

        {currentView === 'reading-lists' && (
          <ReadingListManager
            userData={userData}
            onCreateList={createReadingList}
            onAddToList={addToReadingList}
            onRemoveFromList={removeFromReadingList}
            onBookClick={setSelectedBook}
          />
        )}

        {currentView === 'saved-books' && (
          <div className="saved-books-view">
            <h2>Saved Books</h2>
            <div className="saved-books-grid">
              {userData.savedBooks.map(book => (
                <BookCard
                  key={book.key}
                  book={book}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>
            {userData.savedBooks.length === 0 && (
              <div className="no-saved-books">
                <p>No saved books yet. Start exploring and save books you're interested in!</p>
              </div>
            )}
          </div>
        )}

        {currentView === 'recommendations' && (
          <RecommendationEngine
            onBookClick={setSelectedBook}
          />
        )}

        {currentView === 'reading-goals' && (
          <ReadingGoals />
        )}
      </main>

      <Footer className={`app ${darkMode ? 'dark-mode' : ''}`} darkMode={darkMode} isSidebarOpen={sidebarOpen} />

    </div>
  );
}

function App() {
  return (
    <UserDataProvider>
      <AppContent />
    </UserDataProvider>
  );
}

export default App;