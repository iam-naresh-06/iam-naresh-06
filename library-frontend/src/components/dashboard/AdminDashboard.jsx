// src/components/dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, activity] = await Promise.all([
        dashboardService.getAdminStats(),
        dashboardService.getRecentActivity()
      ]);
      setStats(dashboardStats);
      setRecentActivity(activity);
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
        <h1>Admin Dashboard</h1>
        <p>Welcome to the Library Management System Admin Panel</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.totalBooks || 0}</h3>
            <p>Total Books</p>
          </div>
          <Link to="/books" className="stat-link">View All</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
          <Link to="/admin/users" className="stat-link">Manage</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <h3>{stats.activeBorrows || 0}</h3>
            <p>Active Borrows</p>
          </div>
          <Link to="/circulation/history" className="stat-link">View</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{stats.overdueBooks || 0}</h3>
            <p>Overdue Books</p>
          </div>
          <Link to="/circulation/return" className="stat-link">Manage</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${stats.totalFines || 0}</h3>
            <p>Outstanding Fines</p>
          </div>
          <Link to="/circulation/fines" className="stat-link">Collect</Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.todayBorrows || 0}</h3>
            <p>Today's Borrows</p>
          </div>
          <Link to="/admin/analytics" className="stat-link">Analytics</Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/books/add" className="btn btn-primary">
            Add New Book
          </Link>
          <Link to="/borrowers/add" className="btn btn-primary">
            Add New Borrower
          </Link>
          <Link to="/circulation/borrow" className="btn btn-primary">
            Process Borrow
          </Link>
          <Link to="/circulation/return" className="btn btn-primary">
            Process Return
          </Link>
          <Link to="/admin/reports" className="btn btn-secondary">
            Generate Reports
          </Link>
          <Link to="/admin/config" className="btn btn-secondary">
            System Settings
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.slice(0, 10).map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                {getActivityIcon(activity.type)}
              </div>
              <div className="activity-content">
                <p className="activity-message">{activity.message}</p>
                <span className="activity-time">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
        {recentActivity.length === 0 && (
          <p className="no-activity">No recent activity</p>
        )}
      </div>
    </div>
  );
};

const getActivityIcon = (type) => {
  switch (type) {
    case 'BOOK_ADDED': return '📚';
    case 'BOOK_BORROWED': return '📖';
    case 'BOOK_RETURNED': return '↩️';
    case 'USER_ADDED': return '👤';
    case 'FINE_ADDED': return '💰';
    default: return '📋';
  }
};

export default AdminDashboard;
