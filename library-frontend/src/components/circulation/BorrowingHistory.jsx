// src/components/circulation/BorrowingHistory.jsx
import React, { useState, useEffect } from 'react';
import circulationService from '../../services/circulationService'; // Default import
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const BorrowingHistory = () => {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    loadBorrowHistory();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBorrowHistory = async () => {
    try {
      setLoading(true);
      // Use circulationService.getBorrowHistory() instead of getBorrowHistory()
      const history = await circulationService.getBorrowHistory(
        user.role === 'BORROWER' ? user.id : null
      );
      setBorrowHistory(history);
    } catch (error) {
      console.error('Failed to load borrow history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = borrowHistory.filter(record => {
    switch (filter) {
      case 'active':
        return record.status === 'ACTIVE';
      case 'returned':
        return record.status === 'RETURNED';
      case 'overdue':
        return record.status === 'OVERDUE';
      default:
        return true;
    }
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      ACTIVE: 'status-active',
      RETURNED: 'status-returned',
      OVERDUE: 'status-overdue'
    };
    
    const statusText = {
      ACTIVE: 'Active',
      RETURNED: 'Returned',
      OVERDUE: 'Overdue'
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="circulation-container">
      <div className="page-header">
        <h1>Borrowing History</h1>
        <p>View all book borrowing records</p>
      </div>

      <div className="filter-controls">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="form-select"
        >
          <option value="all">All Records</option>
          <option value="active">Active Borrows</option>
          <option value="returned">Returned Books</option>
          <option value="overdue">Overdue Books</option>
        </select>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                {user.role !== 'BORROWER' && <th>Borrower</th>}
                <th>Book</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Fine Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(record => (
                <tr key={record.id}>
                  {user.role !== 'BORROWER' && (
                    <td>
                      {record.borrower.firstName} {record.borrower.lastName}
                      <br />
                      <small>{record.borrower.libraryCardNumber}</small>
                    </td>
                  )}
                  <td>
                    {record.book.title}
                    <br />
                    <small>by {record.book.author}</small>
                  </td>
                  <td>{new Date(record.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(record.dueDate).toLocaleDateString()}</td>
                  <td>
                    {record.returnDate 
                      ? new Date(record.returnDate).toLocaleDateString()
                      : '-'
                    }
                  </td>
                  <td>{getStatusBadge(record.status)}</td>
                  <td>
                    {record.fineAmount > 0 ? `$${record.fineAmount.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredHistory.length === 0 && (
        <div className="empty-state">
          <h3>No borrowing records found</h3>
          <p>There are no records matching your current filter.</p>
        </div>
      )}
    </div>
  );
};

export default BorrowingHistory;