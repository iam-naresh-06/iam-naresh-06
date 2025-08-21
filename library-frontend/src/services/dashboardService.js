// src/services/dashboardService.js
import api from './api';

const dashboardService = {
  getAdminStats: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },

  getLibrarianStats: async () => {
    const response = await api.get('/dashboard/librarian');
    return response.data;
  },

  getBorrowerStats: async () => {
    const response = await api.get('/dashboard/borrower');
    return response.data;
  },

  getRecentActivity: async () => {
    const response = await api.get('/dashboard/activity');
    return response.data;
  },

  getRecommendedBooks: async () => {
    const response = await api.get('/dashboard/recommendations');
    return response.data;
  }
};

export default dashboardService;
