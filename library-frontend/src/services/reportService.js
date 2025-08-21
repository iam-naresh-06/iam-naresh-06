// src/services/reportService.js
import api from './api';

const reportService = {
  generateReport: async (reportType, params = {}) => {
    const response = await api.post('/reports/generate', {
      reportType,
      params
    });
    return response.data;
  },

  getReportHistory: async () => {
    const response = await api.get('/reports/history');
    return response.data;
  }
};

export default reportService;
