// src/services/bookService.js
import api from './api';

// Named exports
export const getAllBooks = async () => {
  const response = await api.get('/books');
  return response.data;
};

export const getBookById = async (id) => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (bookData) => {
  const response = await api.post('/books', bookData);
  return response.data;
};

export const updateBook = async (id, bookData) => {
  const response = await api.put(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

export const searchBooks = async (query) => {
  const response = await api.get('/books/search', { params: query });
  return response.data;
};

// Default export for backward compatibility
const bookService = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks
};

export default bookService;