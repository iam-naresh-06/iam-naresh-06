import React from 'react';

const BorrowerCard = ({ borrower }) => {
  return (
    <div className="borrower-card">
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
  );
};

export default BorrowerCard;
