// src/components/books/BookCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
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
  );
};

export default BookCard;
