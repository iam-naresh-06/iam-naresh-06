// src/services/notificationService.js
import api from './api';

const handleNotificationError = (error, defaultMessage) => {
  if (error.code === 'ERR_NETWORK') {
    console.warn('Notification service unavailable');
    return null; // Silently fail for notifications
  }
  console.error(defaultMessage, error);
  return null;
};

const notificationService = {
  getNotifications: async () => {
    try {
      const response = await api.get('/api/notifications');
      return response.data;
    } catch (error) {
      return handleNotificationError(error, 'Failed to fetch notifications:');
    }
  },

  getUnreadNotifications: async () => {
    try {
      const response = await api.get('/api/notifications/unread'); // Add /api
      return response.data;
    } catch (error) {
      console.error('Failed to fetch unread notifications:', error);
      return [];
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('/api/notifications/unread-count');
      return response.data;
    } catch (error) {
      handleNotificationError(error, 'Failed to fetch unread count:');
      return 0; // Return 0 instead of throwing
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`); // Add /api
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  },

  markAllAsRead: async () => {
    try {
      await api.patch('/api/notifications/read-all'); // Add /api
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  },

  deleteNotification: async (notificationId) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`); // Add /api
      return true;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return false;
    }
  }
};

export default notificationService;