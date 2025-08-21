// src/components/admin/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';
import LoadingSpinner from '../common/LoadingSpinner';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await analyticsService.getDashboardAnalytics(timeRange);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-container">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Library performance metrics and insights</p>
        
        <div className="time-range-selector">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-select"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Key Metrics */}
        <div className="metric-card">
          <div className="metric-value">{analytics.totalBorrows || 0}</div>
          <div className="metric-label">Total Borrows</div>
          <div className="metric-change">
            {analytics.borrowsChange || 0}% from previous period
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{analytics.activeBorrowers || 0}</div>
          <div className="metric-label">Active Borrowers</div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{analytics.availableBooks || 0}</div>
          <div className="metric-label">Available Books</div>
        </div>

        <div className="metric-card">
          <div className="metric-value">${analytics.revenue || 0}</div>
          <div className="metric-label">Revenue</div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{analytics.overdueBooks || 0}</div>
          <div className="metric-label">Overdue Books</div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{analytics.reservations || 0}</div>
          <div className="metric-label">Active Reservations</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Borrows by Category</h3>
          <div className="chart-placeholder">
            <p>Category distribution chart will be displayed here</p>
          </div>
        </div>

        <div className="chart-card">
          <h3>Monthly Activity</h3>
          <div className="chart-placeholder">
            <p>Monthly activity chart will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Top Lists */}
      <div className="top-lists">
        <div className="top-list-card">
          <h3>Most Popular Books</h3>
          <div className="list">
            {analytics.popularBooks?.slice(0, 5).map((book, index) => (
              <div key={book.id} className="list-item">
                <span className="rank">{index + 1}</span>
                <span className="name">{book.title}</span>
                <span className="count">{book.borrowCount} borrows</span>
              </div>
            )) || <p>No data available</p>}
          </div>
        </div>

        <div className="top-list-card">
          <h3>Top Borrowers</h3>
          <div className="list">
            {analytics.topBorrowers?.slice(0, 5).map((borrower, index) => (
              <div key={borrower.id} className="list-item">
                <span className="rank">{index + 1}</span>
                <span className="name">{borrower.firstName} {borrower.lastName}</span>
                <span className="count">{borrower.borrowCount} books</span>
              </div>
            )) || <p>No data available</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
