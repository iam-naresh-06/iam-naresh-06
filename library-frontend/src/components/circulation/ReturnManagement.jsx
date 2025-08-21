// src/components/circulation/ReturnManagement.jsx
import React, { useState, useEffect } from 'react';
import circulationService from '../../services/circulationService';
import LoadingSpinner from '../common/LoadingSpinner';

const ReturnManagement = () => {
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadActiveBorrows();
  }, []);

  const loadActiveBorrows = async () => {
    try {
      setLoading(true);
      const borrows = await circulationService.getActiveBorrows();
      setActiveBorrows(borrows);
    } catch (err) {
      setError('Failed to load active borrows');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowRecordId, bookCondition = 'GOOD') => {
    try {
      setReturning(true);
      setError('');
      
      const result = await circulationService.returnBook(borrowRecordId, bookCondition);
      
      if (result.fines && result.fines > 0) {
        setSuccess(`Book returned successfully. Fine amount: $${result.fines.toFixed(2)}`);
      } else {
        setSuccess('Book returned successfully');
      }
      
      await loadActiveBorrows();
    } catch (err) {
      setError('Failed to return book');
    } finally {
      setReturning(false);
    }
  };

  const calculateOverdueDays = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const filteredBorrows = activeBorrows.filter(borrow =>
    borrow.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrow.borrower.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrow.borrower.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrow.borrower.libraryCardNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="circulation-container">
      <div className="page-header">
        <h1>Return Management</h1>
        <p>Process book returns and manage overdue items</p>
      </div>

      <div className="circulation-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search active borrows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Borrower</th>
                <th>Book</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Overdue Days</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrows.map((borrow) => {
                const overdueDays = calculateOverdueDays(borrow.dueDate);
                const isOverdue = overdueDays > 0;
                
                return (
                  <tr key={borrow.id} className={isOverdue ? 'overdue' : ''}>
                    <td>
                      {borrow.borrower.firstName} {borrow.borrower.lastName}
                      <br />
                      <small>{borrow.borrower.libraryCardNumber}</small>
                    </td>
                    <td>
                      {borrow.book.title}
                      <br />
                      <small>by {borrow.book.author}</small>
                    </td>
                    <td>{new Date(borrow.borrowDate).toLocaleDateString()}</td>
                    <td>{new Date(borrow.dueDate).toLocaleDateString()}</td>
                    <td>
                      {isOverdue ? (
                        <span className="overdue-badge">{overdueDays} days</span>
                      ) : (
                        'On time'
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${isOverdue ? 'overdue' : 'active'}`}>
                        {isOverdue ? 'Overdue' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleReturn(borrow.id)}
                        disabled={returning}
                        className="btn btn-sm btn-success"
                      >
                        {returning ? 'Processing...' : 'Return'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBorrows.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No active borrows found</h3>
          <p>There are currently no books checked out from the library.</p>
        </div>
      )}
    </div>
  );
};

export default ReturnManagement;
