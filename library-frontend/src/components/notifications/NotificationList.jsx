// src/components/notifications/NotificationList.jsx
import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';
import { useNotifications } from '../../context/NotificationContext';
import LoadingSpinner from '../common/LoadingSpinner';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const notificationsData = await notificationService.getUserNotifications();
      setNotifications(notificationsData);
    } catch (err) {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
      markAsRead(notificationId);
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      markAllAsRead();
    } catch (err) {
      setError('Failed to mark all notifications as read');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(notif => notif.id !== notificationId));
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  const unreadNotifications = notifications.filter(notif => !notif.read);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="notifications-container">
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Manage your library notifications</p>
        
        {unreadNotifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn btn-secondary"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <h3>No notifications</h3>
            <p>You don't have any notifications at this time.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-meta">
                  <span className="notification-date">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                  <span className="notification-type">{notification.type}</span>
                </div>
              </div>
              
              <div className="notification-actions">
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="btn btn-sm btn-primary"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationList;
