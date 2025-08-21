// src/components/books/BookList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookService from '../../services/bookService';  // Fixed import
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await bookService.getAllBooks();
      setBooks(booksData);
    } catch (err) {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await bookService.deleteBook(bookId);
      setBooks(books.filter(book => book.id !== bookId));
      setShowDeleteModal(false);
      setSelectedBook(null);
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  const getGenres = () => {
    const genres = new Set();
    books.forEach(book => {
      if (book.genre) genres.add(book.genre);
    });
    return Array.from(genres);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(book => 
    filterGenre ? book.genre === filterGenre : true
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="books-container">
      <div className="page-header">
        <h1>Book Management</h1>
        <p>Manage library book collection</p>
        <Link to="/books/add" className="btn btn-primary">
          Add New Book
        </Link>
      </div>

      <div className="books-controls">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="form-select"
          >
            <option value="">All Genres</option>
            {getGenres().map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="books-grid">
        {filteredBooks.map(book => (
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
              <h3 className="book-title">{book.title}</h3>
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
                <Link to={`/books/edit/${book.id}`} className="btn btn-sm btn-primary">
                  Edit
                </Link>
                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setShowDeleteModal(true);
                  }}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && selectedBook && (
        <Modal
          title="Confirm Delete"
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedBook(null);
          }}
        >
          <div className="delete-confirmation">
            <p>Are you sure you want to delete "{selectedBook.title}" by {selectedBook.author}?</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedBook.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BookList;