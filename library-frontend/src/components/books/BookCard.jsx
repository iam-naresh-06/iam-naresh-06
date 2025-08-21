import React from 'react';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p className="author">by {book.author}</p>
      <p className="isbn">ISBN: {book.isbn}</p>
      <p className="genre">Genre: {book.genre}</p>
      <p className="year">Published: {book.publicationYear}</p>
      <p className={`availability ${book.availableCopies > 0 ? 'available' : 'unavailable'}`}>
        {book.availableCopies > 0 
          ? `${book.availableCopies} available` 
          : 'Out of stock'}
      </p>
      <div className="book-actions">
        <button disabled={book.availableCopies === 0}>
          {book.availableCopies > 0 ? 'Borrow' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;