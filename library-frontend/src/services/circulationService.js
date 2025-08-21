import api from './api';

export const circulationService = {
  borrowBook: (bookId, borrowerId) => {
    return api.post(`/borrow/${bookId}/borrower/${borrowerId}`)
      .then(response => response.data);
  },

  returnBook: (borrowRecordId) => {
    return api.post(`/borrow/return/${borrowRecordId}`)
      .then(response => response.data);
  },

  renewBook: (borrowRecordId) => {
    return api.post(`/borrow/renew/${borrowRecordId}`)
      .then(response => response.data);
  },

  getBorrowingHistory: (borrowerId) => {
    return api.get(`/borrow/history/borrower/${borrowerId}`)
      .then(response => response.data);
  },

  getActiveBorrows: () => {
    return api.get('/borrow/active')
      .then(response => response.data);
  }
};