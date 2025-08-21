import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import bookService from "../../services/bookService";

const BorrowerDashboard = () => {
  const [stats, setStats] = useState({
    borrowedBooks: 0,
    overdueBooks: 0,
    availableBooks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const books = await bookService.getAllBooks();
      setStats({
        borrowedBooks: 2, // TODO: replace with API for real borrower’s data
        overdueBooks: 1,  // TODO: replace with API for overdue
        availableBooks: books.filter((b) => b.available).length,
      });
    } catch (error) {
      console.error("Error loading borrower dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>Borrower Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Borrowed Books</h3>
          <div className="stat-number">{stats.borrowedBooks}</div>
          <Link to="/my-borrows">View My Books</Link>
        </div>

        <div className="stat-card">
          <h3>Overdue Books</h3>
          <div className="stat-number">{stats.overdueBooks}</div>
          <Link to="/my-borrows">Check Overdue</Link>
        </div>

        <div className="stat-card">
          <h3>Available Books</h3>
          <div className="stat-number">{stats.availableBooks}</div>
          <Link to="/books">Browse Books</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/books" className="action-btn">
            <span>📚</span>
            Browse Books
          </Link>

          <Link to="/my-borrows" className="action-btn">
            <span>📖</span>
            My Borrowed Books
          </Link>

          <Link to="/profile" className="action-btn">
            <span>⚙️</span>
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BorrowerDashboard;
