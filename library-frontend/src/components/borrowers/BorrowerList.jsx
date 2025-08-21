import React, { useState, useEffect } from 'react';
import { borrowerService } from '../../services/borrowerService';
import LoadingSpinner from '../common/LoadingSpinner';

const BorrowerList = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBorrowers();
  }, []);

  const loadBorrowers = async () => {
    try {
      setLoading(true);
      const borrowersData = await borrowerService.getAllBorrowers();
      setBorrowers(borrowersData);
    } catch (err) {
      setError('Failed to load borrowers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="borrower-list">
      <div className="page-header">
        <h1>Borrower Management</h1>
        <p>Manage library members and their accounts</p>
      </div>
      
      <div className="borrowers-grid">
        {borrowers.map(borrower => (
          <div key={borrower.id} className="borrower-card">
            <h3>{borrower.user.firstName} {borrower.user.lastName}</h3>
            <p className="email">Email: {borrower.user.email}</p>
            <p className="card-number">Card: {borrower.libraryCardNumber}</p>
            <p className="membership">Membership: {borrower.membershipType}</p>
            <p className={`status ${borrower.isActive ? 'active' : 'inactive'}`}>
              Status: {borrower.isActive ? 'Active' : 'Inactive'}
            </p>
            <div className="borrower-actions">
              <button>View Details</button>
              <button>Edit</button>
            </div>
          </div>
        ))}
      </div>
      
      {borrowers.length === 0 && (
        <div className="empty-state">
          <p>No borrowers found.</p>
        </div>
      )}
    </div>
  );
};

export default BorrowerList;