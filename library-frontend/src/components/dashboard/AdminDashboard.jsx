import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../../services/bookService';
import { borrowerService } from '../../services/borrowerService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalBorrowers: 0,
    activeLoans: 0,
    overdueBooks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [books, borrowers] = await Promise.all([
        bookService.getAllBooks(),
        borrowerService.getAllBorrowers()
      ]);
      
      setStats({
        totalBooks: books.length,
        totalBorrowers: borrowers.length,
        activeLoans: 0,
        overdueBooks: 0
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
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Books</h3>
          <div className="stat-number">{stats.totalBooks}</div>
          <Link to="/books">View Books</Link>
        </div>
        
        <div className="stat-card">
          <h3>Total Borrowers</h3>
          <div className="stat-number">{stats.totalBorrowers}</div>
          <Link to="/borrowers">Manage Borrowers</Link>
        </div>
        
        <div className="stat-card">
          <h3>Active Loans</h3>
          <div className="stat-number">{stats.activeLoans}</div>
          <Link to="/circulation/history">View Loans</Link>
        </div>
        
        <div className="stat-card">
          <h3>Overdue Books</h3>
          <div className="stat-number">{stats.overdueBooks}</div>
          <Link to="/circulation/history">Manage Overdue</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/books/new" className="action-btn">
            <span>➕</span>
            Add New Book
          </Link>
          
          <Link to="/borrowers/new" className="action-btn">
            <span>👤</span>
            Register Borrower
          </Link>
          
          <Link to="/circulation/borrow" className="action-btn">
            <span>📖</span>
            Process Borrow
          </Link>
          
          <Link to="/circulation/return" className="action-btn">
            <span>↩️</span>
            Process Return
          </Link>
          
          <Link to="/admin/users" className="action-btn">
            <span>👥</span>
            Manage Users
          </Link>
          
          <Link to="/admin/config" className="action-btn">
            <span>⚙️</span>
            System Config
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;