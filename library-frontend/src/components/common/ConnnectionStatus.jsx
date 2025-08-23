// src/components/common/ConnectionStatus.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { error } = useAuth();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="alert alert-warning">
        You are currently offline. Some features may be unavailable.
      </div>
    );
  }

  if (error && error.includes('connection') || error.includes('network')) {
    return (
      <div className="alert alert-error">
        Cannot connect to server. Please try again later.
      </div>
    );
  }

  return null;
};

export default ConnectionStatus;