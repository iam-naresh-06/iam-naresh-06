import React from 'react';

const BorrowerDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Borrower Dashboard</h1>
      <div className="dashboard-content">
        <p>Welcome to your library dashboard. Here you can browse books, view your borrowing history, and manage your account.</p>
        
        <div className="dashboard-cards">
          <div className="card">
            <h3>Available Books</h3>
            <p>Browse our collection of books</p>
            <button onClick={() => window.location.href = '/books'}>
              View Books
            </button>
          </div>
          
          <div className="card">
            <h3>My Borrowings</h3>
            <p>View your current borrowings and history</p>
            <button onClick={() => window.location.href = '/circulation/history'}>
              View History
            </button>
          </div>
          
          <div className="card">
            <h3>My Profile</h3>
            <p>Manage your account settings</p>
            <button disabled>Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowerDashboard;