import api from './api';

export const borrowerService = {
  getAllBorrowers: () => {
    return api.get('/borrowers')
      .then(response => response.data);
  },

  getBorrowerById: (id) => {
    return api.get(`/borrowers/${id}`)
      .then(response => response.data);
  },

  createBorrower: (borrowerData) => {
    return api.post('/borrowers', borrowerData)
      .then(response => response.data);
  },

  updateBorrower: (id, borrowerData) => {
    return api.put(`/borrowers/${id}`, borrowerData)
      .then(response => response.data);
  },

  deleteBorrower: (id) => {
    return api.delete(`/borrowers/${id}`);
  },

  searchBorrowers: (query) => {
    return api.get(`/borrowers/search?query=${query}`)
      .then(response => response.data);
  }
};