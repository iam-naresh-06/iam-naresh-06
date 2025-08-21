// src/services/analyticsService.js
import api from './api';

const analyticsService = {
  getDashboardAnalytics: async (timeRange = '30days') => {
    const response = await api.get('/analytics/dashboard', {
      params: { timeRange }
    });
    return response.data;
  },

  getCirculationAnalytics: async (startDate, endDate) => {
    const response = await api.get('/analytics/circulation', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  getCollectionAnalytics: async () => {
    const response = await api.get('/analytics/collection');
    return response.data;
  }
};

export default analyticsService;
