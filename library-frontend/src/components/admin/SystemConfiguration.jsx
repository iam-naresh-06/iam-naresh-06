// src/components/admin/SystemConfiguration.jsx
import React, { useState, useEffect } from 'react';
import systemService from '../../services/systemService';
import LoadingSpinner from '../common/LoadingSpinner';

const SystemConfiguration = () => {
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const configData = await systemService.getSystemConfig();
      setConfig(configData);
    } catch (err) {
      setError('Failed to load system configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await systemService.updateSystemConfig(config);
      setSuccess('System configuration updated successfully');
    } catch (err) {
      setError('Failed to update system configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-container">
      <div className="page-header">
        <h1>System Configuration</h1>
        <p>Configure library system settings and policies</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="config-form">
        <div className="config-section">
          <h3>Borrowing Policies</h3>
          
          <div className="form-group">
            <label className="form-label">Maximum Books per Borrower</label>
            <input
              type="number"
              value={config.maxBooksPerBorrower || 5}
              onChange={(e) => handleChange('maxBooksPerBorrower', parseInt(e.target.value))}
              className="form-input"
              min="1"
              max="20"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Loan Period (Days)</label>
            <input
              type="number"
              value={config.loanPeriodDays || 14}
              onChange={(e) => handleChange('loanPeriodDays', parseInt(e.target.value))}
              className="form-input"
              min="1"
              max="90"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Renewal Period (Days)</label>
            <input
              type="number"
              value={config.renewalPeriodDays || 7}
              onChange={(e) => handleChange('renewalPeriodDays', parseInt(e.target.value))}
              className="form-input"
              min="1"
              max="30"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Late Fee per Day ($)</label>
            <input
              type="number"
              step="0.01"
              value={config.lateFeePerDay || 0.50}
              onChange={(e) => handleChange('lateFeePerDay', parseFloat(e.target.value))}
              className="form-input"
              min="0"
              max="10"
            />
          </div>
        </div>

        <div className="config-section">
          <h3>System Settings</h3>
          
          <div className="form-group">
            <label className="form-label">Reservation Hold Period (Days)</label>
            <input
              type="number"
              value={config.reservationHoldPeriod || 3}
              onChange={(e) => handleChange('reservationHoldPeriod', parseInt(e.target.value))}
              className="form-input"
              min="1"
              max="14"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Maximum Renewals</label>
            <input
              type="number"
              value={config.maxRenewals || 2}
              onChange={(e) => handleChange('maxRenewals', parseInt(e.target.value))}
              className="form-input"
              min="0"
              max="5"
            />
          </div>

          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={config.allowSelfRegistration || false}
                onChange={(e) => handleChange('allowSelfRegistration', e.target.checked)}
              />
              Allow Self Registration
            </label>
          </div>

          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={config.requireEmailVerification || true}
                onChange={(e) => handleChange('requireEmailVerification', e.target.checked)}
              />
              Require Email Verification
            </label>
          </div>
        </div>

        <div className="config-section">
          <h3>Notification Settings</h3>
          
          <div className="form-group">
            <label className="form-label">Due Date Reminder (Days Before)</label>
            <input
              type="number"
              value={config.dueDateReminderDays || 2}
              onChange={(e) => handleChange('dueDateReminderDays', parseInt(e.target.value))}
              className="form-input"
              min="0"
              max="7"
            />
          </div>

          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={config.sendEmailNotifications || true}
                onChange={(e) => handleChange('sendEmailNotifications', e.target.checked)}
              />
              Send Email Notifications
            </label>
          </div>

          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                checked={config.sendSMSNotifications || false}
                onChange={(e) => handleChange('sendSMSNotifications', e.target.checked)}
              />
              Send SMS Notifications
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Saving...' : 'Save Configuration'}
          </button>
          <button
            type="button"
            onClick={loadConfig}
            className="btn btn-secondary"
          >
            Reset Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemConfiguration;
