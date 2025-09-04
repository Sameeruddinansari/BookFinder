
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserDataContext = createContext();

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

export const UserDataProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    ratings: {},
    savedBooks: [],
    readingLists: {},
    readingProgress: {},
    collections: {},
    recentlyViewed: [],
    readingGoals: {},
    discussions: {},
    profile: { name: 'Anonymous', avatar: null }
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bookFinderUserData');
    if (saved) {
      setUserData(JSON.parse(saved));
    }
  }, []);

  // Save data to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem('bookFinderUserData', JSON.stringify(userData));
  }, [userData]);

  const rateBook = (bookKey, rating) => {
    setUserData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [bookKey]: rating
      }
    }));
  };

  const saveBook = (book) => {
    setUserData(prev => ({
      ...prev,
      savedBooks: [
        ...prev.savedBooks.filter(b => b.key !== book.key),
        { ...book, savedAt: new Date().toISOString() }
      ]
    }));
  };

  const unsaveBook = (bookKey) => {
    setUserData(prev => ({
      ...prev,
      savedBooks: prev.savedBooks.filter(b => b.key !== bookKey)
    }));
  };

  const createReadingList = (name) => {
    const id = Date.now().toString();
    setUserData(prev => ({
      ...prev,
      readingLists: {
        ...prev.readingLists,
        [id]: {
          id,
          name,
          books: [],
          createdAt: new Date().toISOString()
        }
      }
    }));
    return id;
  };

  const addToReadingList = (listId, book) => {
    setUserData(prev => ({
      ...prev,
      readingLists: {
        ...prev.readingLists,
        [listId]: {
          ...prev.readingLists[listId],
          books: [
            ...prev.readingLists[listId].books.filter(b => b.key !== book.key),
            book
          ]
        }
      }
    }));
  };

  const removeFromReadingList = (listId, bookKey) => {
    setUserData(prev => ({
      ...prev,
      readingLists: {
        ...prev.readingLists,
        [listId]: {
          ...prev.readingLists[listId],
          books: prev.readingLists[listId].books.filter(b => b.key !== bookKey)
        }
      }
    }));
  };

  const updateReadingProgress = (bookKey, progress) => {
    setUserData(prev => ({
      ...prev,
      readingProgress: {
        ...prev.readingProgress,
        [bookKey]: {
          ...prev.readingProgress[bookKey],
          ...progress,
          lastUpdated: new Date().toISOString()
        }
      }
    }));
  };

  const isBookSaved = (bookKey) => {
    return userData.savedBooks.some(book => book.key === bookKey);
  };

  const getBookRating = (bookKey) => {
    return userData.ratings[bookKey] || 0;
  };

  const getReadingProgress = (bookKey) => {
    return userData.readingProgress[bookKey] || null;
  };

  const addToRecentlyViewed = (book) => {
    setUserData(prev => ({
      ...prev,
      recentlyViewed: [
        book,
        ...prev.recentlyViewed.filter(b => b.key !== book.key)
      ].slice(0, 20)
    }));
  };

  const getRecentlyViewed = () => {
    return userData.recentlyViewed || [];
  };

  const updateReadingGoals = (goal) => {
    setUserData(prev => ({
      ...prev,
      readingGoals: {
        ...prev.readingGoals,
        [goal.year]: goal
      }
    }));
  };

  const getReadingStats = () => {
    const { readingProgress, ratings } = userData;
    
    const booksCompleted = Object.values(readingProgress).filter(
      p => p.status === 'completed'
    ).length;
    
    const booksReading = Object.values(readingProgress).filter(
      p => p.status === 'reading'
    ).length;
    
    const pagesRead = Object.values(readingProgress).reduce(
      (total, progress) => total + (progress.currentPage || 0), 0
    );
    
    const ratingsArray = Object.values(ratings).filter(r => r > 0);
    const averageRating = ratingsArray.length > 0 
      ? ratingsArray.reduce((sum, r) => sum + r, 0) / ratingsArray.length 
      : 0;

    return {
      booksCompleted,
      booksReading,
      pagesRead,
      averageRating
    };
  };

  const addToDiscussion = (bookKey, comment) => {
    setUserData(prev => ({
      ...prev,
      discussions: {
        ...prev.discussions,
        [bookKey]: [
          ...(prev.discussions[bookKey] || []),
          comment
        ]
      }
    }));
  };

  const getDiscussions = (bookKey) => {
    return userData.discussions[bookKey] || [];
  };

  const exportReadingLists = () => {
    const data = {
      readingLists: userData.readingLists,
      savedBooks: userData.savedBooks,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reading-lists-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <UserDataContext.Provider value={{
      userData,
      rateBook,
      saveBook,
      unsaveBook,
      createReadingList,
      addToReadingList,
      removeFromReadingList,
      updateReadingProgress,
      isBookSaved,
      getBookRating,
      getReadingProgress,
      addToRecentlyViewed,
      getRecentlyViewed,
      updateReadingGoals,
      getReadingStats,
      addToDiscussion,
      getDiscussions,
      exportReadingLists
    }}>
      {children}
    </UserDataContext.Provider>
  );
};
