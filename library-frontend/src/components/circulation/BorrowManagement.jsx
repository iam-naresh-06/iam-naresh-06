import React, { useState, useEffect } from 'react';
import bookService from '../../services/bookService';
import borrowerService from '../../services/borrowerService';
import circulationService from '../../services/circulationService';

const BorrowManagement = () => {
  const [formData, setFormData] = useState({
    bookId: '',
    borrowerId: ''
  });
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [booksData, borrowersData] = await Promise.all([
        bookService.getAllBooks(),
        borrowerService.getAllBorrowers()
      ]);
      
      setBooks(booksData.filter(book => book.availableCopies > 0));
      setBorrowers(borrowersData.filter(borrower => borrower.isActive));
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await circulationService.borrowBook(formData.bookId, formData.borrowerId);
      setSuccess('Book borrowed successfully!');
      setFormData({ bookId: '', borrowerId: '' });
      await loadData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to borrow book');
    } finally {
      setLoading(false);
    }
  };

  const getBorrowerInfo = (borrowerId) => {
    const borrower = borrowers.find(b => b.id === parseInt(borrowerId));
    return borrower ? `${borrower.user.firstName} ${borrower.user.lastName}` : '';
  };

  const getBookInfo = (bookId) => {
    const book = books.find(b => b.id === parseInt(bookId));
    return book ? `${book.title} by ${book.author}` : '';
  };

  return (
    <div className="circulation-management">
      <div className="page-header">
        <h1>Borrow Book</h1>
        <p>Process book borrowing for library members</p>
      </div>

      <form onSubmit={handleSubmit} className="circulation-form">
        <div className="form-section">
          <h2>Select Borrower</h2>
          <select
            name="borrowerId"
            value={formData.borrowerId}
            onChange={(e) => setFormData({...formData, borrowerId: e.target.value})}
            required
          >
            <option value="">Select Borrower</option>
            {borrowers.map(borrower => (
              <option key={borrower.id} value={borrower.id}>
                {borrower.user.firstName} {borrower.user.lastName} 
                ({borrower.libraryCardNumber}) - {borrower.membershipType}
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <h2>Select Book</h2>
          <select
            name="bookId"
            value={formData.bookId}
            onChange={(e) => setFormData({...formData, bookId: e.target.value})}
            required
          >
            <option value="">Select Book</option>
            {books.map(book => (
              <option key={book.id} value={book.id}>
                {book.title} by {book.author} 
                ({book.availableCopies} available)
              </option>
            ))}
          </select>
        </div>

        {formData.bookId && formData.borrowerId && (
          <div className="confirmation-section">
            <h3>Transaction Summary</h3>
            <p><strong>Borrower:</strong> {getBorrowerInfo(formData.borrowerId)}</p>
            <p><strong>Book:</strong> {getBookInfo(formData.bookId)}</p>
            <p><strong>Due Date:</strong> {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" disabled={loading || !formData.bookId || !formData.borrowerId}>
          {loading ? 'Processing...' : 'Confirm Borrow'}
        </button>
      </form>
    </div>
  );
};

export default BorrowManagement;
