// src/services/circulationService.js
import api from './api';

const circulationService = {
  borrowBook: async (bookId, borrowerId) => {
    const response = await api.post('/circulation/borrow', { bookId, borrowerId });
    return response.data;
  },

  returnBook: async (borrowRecordId, condition = 'GOOD') => {
    const response = await api.post('/circulation/return', { borrowRecordId, condition });
    return response.data;
  },

  renewBook: async (borrowRecordId) => {
    const response = await api.post('/circulation/renew', { borrowRecordId });
    return response.data;
  },

  // Add the missing getBorrowHistory method
  getBorrowHistory: async (borrowerId = null) => {
    const url = borrowerId ? `/circulation/history?borrowerId=${borrowerId}` : '/circulation/history';
    const response = await api.get(url);
    return response.data;
  },

  getActiveBorrows: async (borrowerId = null) => {
    const url = borrowerId ? `/circulation/active?borrowerId=${borrowerId}` : '/circulation/active';
    const response = await api.get(url);
    return response.data;
  },

  getFines: async (borrowerId = null) => {
    const url = borrowerId ? `/circulation/fines?borrowerId=${borrowerId}` : '/circulation/fines';
    const response = await api.get(url);
    return response.data;
  },

  payFine: async (fineId) => {
    const response = await api.post(`/circulation/fines/${fineId}/pay`);
    return response.data;
  }
};

export default circulationService;