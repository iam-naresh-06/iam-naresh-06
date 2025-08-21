// src/services/borrowerService.js
import api from './api';

const borrowerService = {
  getAllBorrowers: async () => {
    const response = await api.get('/borrowers');
    return response.data;
  },

  getBorrowerById: async (id) => {
    const response = await api.get(`/borrowers/${id}`);
    return response.data;
  },

  createBorrower: async (borrowerData) => {
    const response = await api.post('/borrowers', borrowerData);
    return response.data;
  },

  updateBorrower: async (id, borrowerData) => {
    const response = await api.put(`/borrowers/${id}`, borrowerData);
    return response.data;
  },

  deleteBorrower: async (id) => {
    const response = await api.delete(`/borrowers/${id}`);
    return response.data;
  },

  updateBorrowerStatus: async (id, status) => {
    const response = await api.patch(`/borrowers/${id}/status`, { isActive: status });
    return response.data;
  }
};

export default borrowerService;
