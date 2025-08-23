// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard Components
import AdminDashboard from './components/dashboard/AdminDashboard';
import LibrarianDashboard from './components/dashboard/LibrarianDashboard';
import BorrowerDashboard from './components/dashboard/BorrowerDashboard';

// Book Components
import BookList from './components/books/BookList';
import BookForm from './components/books/BookForm';
import BookSearch from './components/books/BookSearch';

// Borrower Components
import BorrowerList from './components/borrowers/BorrowerList';
import BorrowerForm from './components/borrowers/BorrowerForm';

// Circulation Components
import BorrowManagement from './components/circulation/BorrowManagement';
import ReturnManagement from './components/circulation/ReturnManagement';
import BorrowingHistory from './components/circulation/BorrowingHistory';
import FineManagement from './components/circulation/FineManagement';

// Admin Components
import UserManagement from './components/admin/UserManagement';
import SystemConfiguration from './components/admin/SystemConfiguration';
import AnalyticsDashboard from './components/admin/AnalyticsDashboard';
import Reports from './components/admin/Reports';

// Notification Components
import NotificationList from './components/notifications/NotificationList';
import NotificationSettings from './components/notifications/NotificationSettings';

// Styles
import './App.css';
import './styles/components/auth.css';
import './styles/components/books.css';
import './styles/components/dashboard.css';
import './styles/components/circulation.css';
import ConnectionStatus from './components/common/ConnnectionStatus';
function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Navbar />
      <ConnectionStatus />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'ADMIN' && <AdminDashboard />}
              {user?.role === 'LIBRARIAN' && <LibrarianDashboard />}
              {(user?.role === 'BORROWER' || user?.role === 'STAFF') && <BorrowerDashboard />}
            </ProtectedRoute>
          } />

          {/* Book Management */}
          <Route path="/books" element={<ProtectedRoute><BookList /></ProtectedRoute>} />
          <Route path="/books/add" element={<ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><BookForm /></ProtectedRoute>} />
          <Route path="/books/edit/:id" element={<ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><BookForm /></ProtectedRoute>} />
          <Route path="/books/search" element={<ProtectedRoute><BookSearch /></ProtectedRoute>} />

          {/* Borrower Management */}
          <Route path="/borrowers" element={<ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><BorrowerList /></ProtectedRoute>} />
          <Route path="/borrowers/add" element={<ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><BorrowerForm /></ProtectedRoute>} />
          <Route path="/borrowers/edit/:id" element={<ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><BorrowerForm /></ProtectedRoute>} />

          {/* Circulation Management */}
          <Route path="/circulation/borrow" element={<ProtectedRoute roles={['ADMIN', 'LIBRARIAN', 'STAFF']}><BorrowManagement /></ProtectedRoute>} />
          <Route path="/circulation/return" element={<ProtectedRoute roles={['ADMIN', 'LIBRARIAN', 'STAFF']}><ReturnManagement /></ProtectedRoute>} />
          <Route path="/circulation/history" element={<ProtectedRoute><BorrowingHistory /></ProtectedRoute>} />
          <Route path="/circulation/fines" element={<ProtectedRoute><FineManagement /></ProtectedRoute>} />

          {/* Admin Management */}
          <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/config" element={<ProtectedRoute roles={['ADMIN']}><SystemConfiguration /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><AnalyticsDashboard /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute roles={['ADMIN', 'LIBRARIAN']}><Reports /></ProtectedRoute>} />

          {/* Notifications */}
          <Route path="/notifications" element={<ProtectedRoute><NotificationList /></ProtectedRoute>} />
          <Route path="/notifications/settings" element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />

          {/* 404 Page */}
          <Route path="*" element={<div className="page-not-found">Page Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
