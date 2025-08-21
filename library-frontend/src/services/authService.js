import api from './api';

export const authService = {
  login: (email, password) => {
    return api.post('/auth/login', { email, password })
      .then(response => response.data);
  },

  register: (userData) => {
    return api.post('/auth/register', userData)
      .then(response => response.data);
  },

  logout: () => {
    return api.post('/auth/logout');
  }
};