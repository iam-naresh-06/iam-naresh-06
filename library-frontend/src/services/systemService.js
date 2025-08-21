// src/services/systemService.js
import api from './api';

const systemService = {
  getSystemConfig: async () => {
    const response = await api.get('/system/config');
    return response.data;
  },

  updateSystemConfig: async (config) => {
    const response = await api.put('/system/config', config);
    return response.data;
  },

  getSystemStatus: async () => {
    const response = await api.get('/system/status');
    return response.data;
  },

  backupDatabase: async () => {
    const response = await api.post('/system/backup');
    return response.data;
  }
};

export default systemService;
