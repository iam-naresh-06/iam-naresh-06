// src/components/dashboard/BorrowerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../services/dashboardService';
import LoadingSpinner from '../common/LoadingSpinner';

const BorrowerDashboard = () => {
  const [userStats, setUserStats] = useState({});
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, books] = await Promise.all([
        dashboardService.getBorrowerStats(),
        dashboardService.getRecommendedBooks()
      ]);
      setUserStats(stats);
      setRecentBooks(books);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h1>Welcome, {user?.firstName}!</h1>
        <p>Your Library Dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <h3>{userStats.currentBorrows || 0}</h3>
            <p>Books Borrowed</p>
          </div>
          <Link to="/circulation/history" className="stat-link">View History</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{userStats.overdueBooks || 0}</h3>
            <p>Overdue Books</p>
          </div>
          <Link to="/circulation/history" className="stat-link">View Details</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${userStats.outstandingFines || 0}</h3>
            <p>Outstanding Fines</p>
          </div>
          <Link to="/circulation/fines" className="stat-link">Pay Now</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{userStats.reservations || 0}</h3>
            <p>Active Reservations</p>
          </div>
          <Link to="/circulation/reservations" className="stat-link">Manage</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Access</h2>
        <div className="action-buttons">
          <Link to="/books/search" className="btn btn-primary">
            Search Books
          </Link>
          <Link to="/circulation/history" className="btn btn-secondary">
            Borrowing History
          </Link>
          <Link to="/notifications" className="btn btn-secondary">
            Notifications
          </Link>
          <Link to="/profile" className="btn btn-secondary">
            My Profile
          </Link>
        </div>
      </div>

      {recentBooks.length > 0 && (
        <div className="recommended-books">
          <h2>Recommended For You</h2>
          <div className="books-grid">
            {recentBooks.slice(0, 6).map(book => (
              <div key={book.id} className="book-card">
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
                  <div className="book-actions">
                    <Link to={`/books/details/${book.id}`} className="btn btn-sm btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userStats.recentBorrows && userStats.recentBorrows.length > 0 && (
        <div className="recent-activity">
          <h2>Your Recent Activity</h2>
          <div className="activity-list">
            {userStats.recentBorrows.slice(0, 5).map(borrow => (
              <div key={borrow.id} className="activity-item">
                <div className="activity-icon">📖</div>
                <div className="activity-content">
                  <p>Borrowed "{borrow.book.title}"</p>
                  <span className="activity-time">
                    {new Date(borrow.borrowDate).toLocaleDateString()}
                    {borrow.dueDate && ` - Due: ${new Date(borrow.dueDate).toLocaleDateString()}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowerDashboard;
