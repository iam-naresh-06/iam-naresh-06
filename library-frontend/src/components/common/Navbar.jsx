// src/components/common/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications = [], unreadCount = 0 } = useNotifications(); // fallback to avoid undefined
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "ADMIN":
        return "/admin/users";
      case "LIBRARIAN":
        return "/books";
      case "STAFF":
        return "/circulation/borrow";
      default:
        return "/books/search";
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={getDashboardPath()}>Library Management System</Link>
      </div>

      {user && (
        <>
          <button
            className="navbar-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
            <div className="navbar-start">
              {/* Admin Links */}
              {user.role === "ADMIN" && (
                <>
                  <Link to="/admin/users" className="navbar-item">
                    Users
                  </Link>
                  <Link to="/admin/config" className="navbar-item">
                    Configuration
                  </Link>
                  <Link to="/admin/analytics" className="navbar-item">
                    Analytics
                  </Link>
                  <Link to="/admin/reports" className="navbar-item">
                    Reports
                  </Link>
                </>
              )}

              {/* Librarian Links */}
              {(user.role === "ADMIN" || user.role === "LIBRARIAN") && (
                <>
                  <Link to="/books" className="navbar-item">
                    Books
                  </Link>
                  <Link to="/borrowers" className="navbar-item">
                    Borrowers
                  </Link>
                </>
              )}

              {/* Staff Links */}
              {(user.role === "ADMIN" ||
                user.role === "LIBRARIAN" ||
                user.role === "STAFF") && (
                <>
                  <Link to="/circulation/borrow" className="navbar-item">
                    Borrow
                  </Link>
                  <Link to="/circulation/return" className="navbar-item">
                    Return
                  </Link>
                </>
              )}

              {/* All Authenticated Users */}
              <Link to="/books/search" className="navbar-item">
                Search
              </Link>
              <Link to="/circulation/history" className="navbar-item">
                History
              </Link>
            </div>

            <div className="navbar-end">
              <Link to="/notifications" className="navbar-item">
                Notifications
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </Link>
              <div className="navbar-item user-menu">
                <span>Welcome, {user.firstName}</span>
                <div className="dropdown">
                  <Link to="/profile" className="dropdown-item">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
