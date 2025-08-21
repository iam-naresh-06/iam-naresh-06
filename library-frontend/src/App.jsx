import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Dashboard Components
import AdminDashboard from './components/dashboard/AdminDashboard';
import LibrarianDashboard from './components/dashboard/LibrarianDashboard';
import BorrowerDashboard from './components/dashboard/BorrowerDashboard';

// Book Management
import BookList from './components/books/BookList';
import BookForm from './components/books/BookForm';
import BookSearch from './components/books/BookSearch';

// Borrower Management
import BorrowerList from './components/borrowers/BorrowerList';
import BorrowerForm from './components/borrowers/BorrowerForm';

// Circulation Management
import BorrowManagement from './components/circulation/BorrowManagement';
import ReturnManagement from './components/circulation/ReturnManagement';
import BorrowingHistory from './components/circulation/BorrowingHistory';

// Admin Features
import SystemConfiguration from './components/admin/SystemConfiguration';
import AnalyticsDashboard from './components/admin/AnalyticsDashboard';
import UserManagement from './components/admin/UserManagement';

import './App.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - Role-based dashboards */}
          <Route path="/" element={
            <ProtectedRoute>
              {user?.role === 'ADMIN' && <AdminDashboard />}
              {user?.role === 'LIBRARIAN' && <LibrarianDashboard />}
              {user?.role === 'BORROWER' && <BorrowerDashboard />}
            </ProtectedRoute>
          } />
          
          {/* Book Management */}
          <Route path="/books" element={
            <ProtectedRoute>
              <BookList />
            </ProtectedRoute>
          } />
          
          <Route path="/books/new" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
              <BookForm />
            </ProtectedRoute>
          } />
          
          <Route path="/books/edit/:id" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
              <BookForm />
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute>
              <BookSearch />
            </ProtectedRoute>
          } />
          
          {/* Borrower Management */}
          <Route path="/borrowers" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
              <BorrowerList />
            </ProtectedRoute>
          } />
          
          <Route path="/borrowers/new" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
              <BorrowerForm />
            </ProtectedRoute>
          } />
          
          {/* Circulation Management */}
          <Route path="/circulation/borrow" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
              <BorrowManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/circulation/return" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
              <ReturnManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/circulation/history" element={
            <ProtectedRoute>
              <BorrowingHistory />
            </ProtectedRoute>
          } />
          
          {/* Admin Features */}
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/config" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <SystemConfiguration />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'LIBRARIAN']}>
              <AnalyticsDashboard />
            </ProtectedRoute>
          } />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;