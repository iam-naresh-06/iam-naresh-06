import { useState, useEffect } from "react";
import * as bookService from "../services/bookService";

// Custom hook for managing books
export default function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await bookService.getAllBooks();
      setBooks(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book) => {
    try {
      const response = await bookService.addBook(book);
      setBooks((prev) => [...prev, response.data]);
    } catch (err) {
      setError(err.message || "Failed to add book");
    }
  };

  const updateBook = async (id, book) => {
    try {
      const response = await bookService.updateBook(id, book);
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? response.data : b))
      );
    } catch (err) {
      setError(err.message || "Failed to update book");
    }
  };

  const deleteBook = async (id) => {
    try {
      await bookService.deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete book");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return { books, loading, error, fetchBooks, addBook, updateBook, deleteBook };
}
