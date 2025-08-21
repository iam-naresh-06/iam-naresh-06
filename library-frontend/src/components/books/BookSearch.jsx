// src/components/books/BookSearch.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import bookService from '../../services/bookService';

const BookSearch = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    genre: '',
    author: '',
    availability: ''
  });

  useEffect(() => {
    if (searchQuery || filters.genre || filters.author) {
      performSearch();
    }
  }, [searchQuery, filters]);

const performSearch = async () => {
    setLoading(true);
    try {
      // Use bookService.searchBooks() instead of searchBooks()
      const results = await bookService.searchBooks({
        query: searchQuery,
        genre: filters.genre,
        author: filters.author,
        available: filters.availability === 'available'
      });
      setBooks(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({ genre: '', author: '', availability: '' });
  };

  return (
    <div className="books-container">
      <div className="page-header">
        <h1>Book Search</h1>
        <p>Find books in our library collection</p>
      </div>

      <div className="search-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange('genre', e.target.value)}
            className="form-select"
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science">Science</option>
            <option value="Technology">Technology</option>
            <option value="History">History</option>
          </select>

          <input
            type="text"
            placeholder="Filter by author..."
            value={filters.author}
            onChange={(e) => handleFilterChange('author', e.target.value)}
            className="form-input"
          />

          <select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            className="form-select"
          >
            <option value="">All Books</option>
            <option value="available">Available Only</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <button onClick={clearFilters} className="btn btn-secondary">
            Clear Filters
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner />}

      <div className="search-results">
        <h3>Search Results ({books.length} books found)</h3>
        
        {books.length === 0 && !loading && (
          <div className="empty-state">
            <p>No books found matching your criteria.</p>
          </div>
        )}

        <div className="books-grid">
          {books.map(book => (
            <div key={book.id} className="book-card">
              <div className="book-cover">
                {book.coverImage ? (
                  <img src={book.coverImage} alt={book.title} />
                ) : (
                  <div className="book-cover-placeholder">
                    {book.title.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="book-info">
                <h4 className="book-title">{book.title}</h4>
                <p className="book-author">by {book.author}</p>
                <p className="book-isbn">ISBN: {book.isbn}</p>
                <p className="book-genre">{book.genre}</p>
                
                <div className="book-status">
                  <span className={`status ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
                    {book.availableCopies > 0 ? 
                      `${book.availableCopies} available` : 
                      'Unavailable'
                    }
                  </span>
                </div>

                <div className="book-actions">
                  <Link to={`/books/details/${book.id}`} className="btn btn-sm btn-primary">
                    View Details
                  </Link>
                  {book.availableCopies > 0 && (
                    <Link to={`/circulation/borrow?bookId=${book.id}`} className="btn btn-sm btn-success">
                      Borrow
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookSearch;
