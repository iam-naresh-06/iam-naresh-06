import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/bookService';

const LibrarianDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const books = await bookService.getAllBooks();
      const availableBooks = books.filter(book => book.availableCopies > 0).length;
      const borrowedBooks = books.filter(book => book.availableCopies < book.totalCopies).length;
      
      setStats({
        totalBooks: books.length,
        availableBooks,
        borrowedBooks
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1>Librarian Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Books</h3>
          <div className="stat-number">{stats.totalBooks}</div>
          <Link to="/books">View Catalog</Link>
        </div>
        
        <div className="stat-card">
          <h3>Available Books</h3>
          <div className="stat-number">{stats.availableBooks}</div>
          <Link to="/books">View Available</Link>
        </div>
        
        <div className="stat-card">
          <h3>Borrowed Books</h3>
          <div className="stat-number">{stats.borrowedBooks}</div>
          <Link to="/circulation/history">View Loans</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/books/new" className="action-btn">
            <span>➕</span>
            Add New Book
          </Link>
          
          <Link to="/circulation/borrow" className="action-btn">
            <span>📖</span>
            Borrow Book
          </Link>
          
          <Link to="/circulation/return" className="action-btn">
            <span>↩️</span>
            Return Book
          </Link>
          
          <Link to="/search" className="action-btn">
            <span>🔍</span>
            Advanced Search
          </Link>
          
          <Link to="/borrowers" className="action-btn">
            <span>👥</span>
            Manage Borrowers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LibrarianDashboard;