// src/components/notifications/NotificationSettings.jsx
import React, { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService'; // Default import
import LoadingSpinner from '../common/LoadingSpinner';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    dueDateReminders: true,
    overdueAlerts: true,
    reservationReady: true,
    newBooks: false,
    promotions: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

const loadSettings = async () => {
    try {
      setLoading(true);
      // Use notificationService.getNotificationSettings() instead of getNotificationSettings()
      const userSettings = await notificationService.getNotificationSettings();
      setSettings(userSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSuccess('');
      // Use notificationService.updateNotificationSettings() instead of updateNotificationSettings()
      await notificationService.updateNotificationSettings(settings);
      setSuccess('Notification settings updated successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="notifications-container">
      <div className="page-header">
        <h1>Notification Settings</h1>
        <p>Manage how you receive library notifications</p>
      </div>

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="settings-card">
        <h3>Notification Channels</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <h4>Email Notifications</h4>
            <p>Receive notifications via email</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h4>SMS Notifications</h4>
            <p>Receive notifications via text message</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.smsNotifications}
              onChange={() => handleToggle('smsNotifications')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-card">
        <h3>Notification Types</h3>
        
        <div className="setting-item">
          <div className="setting-info">
            <h4>Due Date Reminders</h4>
            <p>Get reminded before books are due</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.dueDateReminders}
              onChange={() => handleToggle('dueDateReminders')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h4>Overdue Alerts</h4>
            <p>Get notified when books become overdue</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.overdueAlerts}
              onChange={() => handleToggle('overdueAlerts')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h4>Reservation Ready</h4>
            <p>Get notified when reserved books are available</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.reservationReady}
              onChange={() => handleToggle('reservationReady')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h4>New Books</h4>
            <p>Get notified about new book arrivals</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.newBooks}
              onChange={() => handleToggle('newBooks')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h4>Promotions & Events</h4>
            <p>Get notified about library events and promotions</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.promotions}
              onChange={() => handleToggle('promotions')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-actions">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        <button
          onClick={loadSettings}
          className="btn btn-secondary"
        >
          Reset Changes
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
