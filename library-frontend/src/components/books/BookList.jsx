import React, { useState, useEffect } from 'react';
import { bookService } from '../../services/bookService';
import BookCard from './BookCard';
import LoadingSpinner from '../common/LoadingSpinner';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await bookService.getAllBooks();
      setBooks(booksData);
    } catch (err) {
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="book-list">
      <div className="page-header">
        <h1>Book Catalog</h1>
        <p>Browse our collection of {books.length} books</p>
      </div>
      
      <div className="books-grid">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      
      {books.length === 0 && (
        <div className="empty-state">
          <p>No books found in the catalog.</p>
        </div>
      )}
    </div>
  );
};

export default BookList;