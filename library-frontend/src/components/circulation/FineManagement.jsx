// src/components/circulation/FineManagement.jsx
import React, { useState, useEffect } from 'react';
import circulationService from '../../services/circulationService'; // Default import
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const FineManagement = () => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadFines();
  }, []);

 const loadFines = async () => {
    try {
      setLoading(true);
      // Use circulationService.getFines() instead of getFines()
      const finesData = await circulationService.getFines(
        user.role === 'BORROWER' ? user.id : null
      );
      setFines(finesData);
    } catch (error) {
      console.error('Failed to load fines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayFine = async (fineId) => {
    try {
      setProcessing(true);
      // Use circulationService.payFine() instead of payFine()
      await circulationService.payFine(fineId);
      await loadFines(); // Reload fines after payment
    } catch (error) {
      console.error('Failed to pay fine:', error);
    } finally {
      setProcessing(false);
    }
  };

  const totalOutstanding = fines
    .filter(fine => fine.status === 'OUTSTANDING')
    .reduce((sum, fine) => sum + fine.amount, 0);

  const totalPaid = fines
    .filter(fine => fine.status === 'PAID')
    .reduce((sum, fine) => sum + fine.amount, 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="circulation-container">
      <div className="page-header">
        <h1>Fine Management</h1>
        <p>Manage and pay library fines</p>
      </div>

      <div className="fine-summary">
        <div className="summary-card">
          <h3>Total Outstanding</h3>
          <div className="amount outstanding">${totalOutstanding.toFixed(2)}</div>
        </div>
        <div className="summary-card">
          <h3>Total Paid</h3>
          <div className="amount paid">${totalPaid.toFixed(2)}</div>
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                {user.role !== 'BORROWER' && <th>Borrower</th>}
                <th>Book</th>
                <th>Reason</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Issue Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fines.map(fine => (
                <tr key={fine.id}>
                  {user.role !== 'BORROWER' && (
                    <td>
                      {fine.borrower.firstName} {fine.borrower.lastName}
                      <br />
                      <small>{fine.borrower.libraryCardNumber}</small>
                    </td>
                  )}
                  <td>
                    {fine.book.title}
                    <br />
                    <small>by {fine.book.author}</small>
                  </td>
                  <td>{fine.reason}</td>
                  <td>${fine.amount.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${fine.status.toLowerCase()}`}>
                      {fine.status}
                    </span>
                  </td>
                  <td>{new Date(fine.issueDate).toLocaleDateString()}</td>
                  <td>
                    {fine.status === 'OUTSTANDING' && (
                      <button
                        onClick={() => handlePayFine(fine.id)}
                        disabled={processing}
                        className="btn btn-sm btn-success"
                      >
                        {processing ? 'Processing...' : 'Pay Now'}
                      </button>
                    )}
                    {fine.status === 'PAID' && (
                      <span className="paid-text">Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {fines.length === 0 && (
        <div className="empty-state">
          <h3>No fines found</h3>
          <p>There are no fines to display at this time.</p>
        </div>
      )}
    </div>
  );
};

export default FineManagement;
