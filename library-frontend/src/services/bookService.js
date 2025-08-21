import api from './api';

export const bookService = {
  getAllBooks: () => {
    return api.get('/books')
      .then(response => response.data);
  },

  getBookById: (id) => {
    return api.get(`/books/${id}`)
      .then(response => response.data);
  },

  createBook: (bookData) => {
    return api.post('/books', bookData)
      .then(response => response.data);
  },

  updateBook: (id, bookData) => {
    return api.put(`/books/${id}`, bookData)
      .then(response => response.data);
  },

  deleteBook: (id) => {
    return api.delete(`/books/${id}`);
  },

  searchBooks: (query, author, genre, available) => {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (author) params.append('author', author);
    if (genre) params.append('genre', genre);
    if (available !== undefined) params.append('available', available);
    
    return api.get(`/books/search?${params.toString()}`)
      .then(response => response.data);
  }
};