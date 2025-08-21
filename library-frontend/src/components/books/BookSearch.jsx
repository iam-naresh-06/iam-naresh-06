import React, { useState } from 'react';
import { bookService } from '../../services/bookService';
import BookCard from './BookCard';

const BookSearch = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    query: '',
    author: '',
    genre: '',
    publicationYear: '',
    available: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const searchResults = await bookService.searchBooks(
        searchCriteria.query,
        searchCriteria.author,
        searchCriteria.genre,
        searchCriteria.available === 'true' ? true : searchCriteria.available === 'false' ? false : undefined
      );
      setResults(searchResults);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchCriteria({
      query: '',
      author: '',
      genre: '',
      publicationYear: '',
      available: ''
    });
    setResults([]);
  };

  return (
    <div className="book-search">
      <div className="page-header">
        <h1>Advanced Book Search</h1>
        <p>Search our library collection with advanced filters</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-grid">
          <div className="form-group">
            <label>Title/Keyword:</label>
            <input
              type="text"
              name="query"
              value={searchCriteria.query}
              onChange={handleInputChange}
              placeholder="Search by title, author, or keyword"
            />
          </div>

          <div className="form-group">
            <label>Author:</label>
            <input
              type="text"
              name="author"
              value={searchCriteria.author}
              onChange={handleInputChange}
              placeholder="Filter by author"
            />
          </div>

          <div className="form-group">
            <label>Genre:</label>
            <input
              type="text"
              name="genre"
              value={searchCriteria.genre}
              onChange={handleInputChange}
              placeholder="Filter by genre"
            />
          </div>

          <div className="form-group">
            <label>Publication Year:</label>
            <input
              type="number"
              name="publicationYear"
              value={searchCriteria.publicationYear}
              onChange={handleInputChange}
              placeholder="Filter by year"
              min="1000"
              max="2025"
            />
          </div>

          <div className="form-group">
            <label>Availability:</label>
            <select
              name="available"
              value={searchCriteria.available}
              onChange={handleInputChange}
            >
              <option value="">All Books</option>
              <option value="true">Available Only</option>
              <option value="false">Borrowed Only</option>
            </select>
          </div>
        </div>

        <div className="search-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search Books'}
          </button>
          <button type="button" onClick={clearSearch} className="secondary">
            Clear
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      <div className="search-results">
        <h2>Search Results ({results.length} books found)</h2>
        
        {results.length > 0 ? (
          <div className="results-grid">
            {results.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          !loading && (
            <div className="no-results">
              <p>No books found matching your search criteria.</p>
              <p>Try adjusting your filters or search terms.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BookSearch;