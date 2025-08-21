// src/components/borrowers/BorrowerList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import borrowerService from '../../services/borrowerService';
import LoadingSpinner from '../common/LoadingSpinner';

const BorrowerList = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBorrowers();
  }, []);

  const loadBorrowers = async () => {
    try {
      setLoading(true);
      const borrowersData = await borrowerService.getAllBorrowers();
      setBorrowers(borrowersData);
    } catch (err) {
      setError('Failed to load borrowers');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (borrowerId, currentStatus) => {
    try {
      await borrowerService.updateBorrowerStatus(borrowerId, !currentStatus);
      setBorrowers(borrowers.map(borrower =>
        borrower.id === borrowerId
          ? { ...borrower, isActive: !currentStatus }
          : borrower
      ));
    } catch (err) {
      setError('Failed to update borrower status');
    }
  };

  const filteredBorrowers = borrowers.filter(borrower =>
    `${borrower.firstName} ${borrower.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrower.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrower.libraryCardNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="borrowers-container">
      <div className="page-header">
        <h1>Borrower Management</h1>
        <p>Manage library borrowers and members</p>
        <Link to="/borrowers/add" className="btn btn-primary">
          Add New Borrower
        </Link>
      </div>

      <div className="borrowers-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search borrowers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Library Card</th>
                <th>Membership Type</th>
                <th>Status</th>
                <th>Borrowed Books</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBorrowers.map((borrower) => (
                <tr key={borrower.id}>
                  <td>
                    {borrower.firstName} {borrower.lastName}
                  </td>
                  <td>{borrower.email}</td>
                  <td>{borrower.libraryCardNumber}</td>
                  <td>
                    <span className={`membership-badge ${borrower.membershipType.toLowerCase()}`}>
                      {borrower.membershipType}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${borrower.isActive ? 'active' : 'inactive'}`}>
                      {borrower.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{borrower.currentBorrows || 0}</td>
                  <td>
                    <div className="action-buttons">
                      <Link
                        to={`/borrowers/edit/${borrower.id}`}
                        className="btn btn-sm btn-primary"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(borrower.id, borrower.isActive)}
                        className={`btn btn-sm ${borrower.isActive ? 'btn-warning' : 'btn-success'}`}
                      >
                        {borrower.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BorrowerList;
