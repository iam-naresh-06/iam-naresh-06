// src/components/notifications/NotificationList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNotifications } from '../../context/NotificationContext';

const NotificationList = () => {
  const { loadUnreadCount } = useNotifications();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Moved fetchNotifications inside useEffect to satisfy ESLint
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data || []);
        loadUnreadCount(); // update unread badge
      } catch (err) {
        console.error('Failed to load notifications:', err);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [loadUnreadCount]); // include only the necessary dependency

  if (!notifications.length) return <p>No notifications</p>;

  return (
    <div className="notification-list">
      {notifications.map(n => (
        <div key={n.id} className={`notification-item ${n.read ? '' : 'unread'}`}>
          <p>{n.message}</p>
          <small>{new Date(n.timestamp).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
