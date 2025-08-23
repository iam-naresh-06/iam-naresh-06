// src/services/authService.js
import api from './api';

const handleApiError = (error) => {
  if (error.code === 'ERR_NETWORK') {
    throw new Error('Cannot connect to server. Please check your connection.');
  }
  
  const message = error.response?.data?.message || 
                 error.message || 
                 'An unexpected error occurred';
  throw new Error(message);
};

const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // ... other methods with similar try-catch blocks

  getCurrentUser: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      // Don't throw for getCurrentUser to avoid login loops
      console.error('Failed to get current user:', error);
      return null;
    }
  },
};

export default authService;