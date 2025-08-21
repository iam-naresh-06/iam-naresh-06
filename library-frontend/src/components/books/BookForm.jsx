// src/components/books/BookForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookService from '../../services/bookService';
import LoadingSpinner from '../common/LoadingSpinner';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    description: '',
    totalCopies: 1,
    availableCopies: 1,
    coverImage: ''
  });

  useEffect(() => {
    if (id) {
      loadBook();
    }
  }, [id]);

  const loadBook = async () => {
    try {
      setLoading(true);
      const book = await bookService.getBookById(id);
      setFormData(book);
    } catch (err) {
      setError('Failed to load book');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (id) {
        await bookService.updateBook(id, formData);
        setSuccess('Book updated successfully');
      } else {
        await bookService.createBook(formData);
        setSuccess('Book created successfully');
      }
      
      setTimeout(() => {
        navigate('/books');
      }, 1000);
    } catch (err) {
      setError('Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="book-form-container">
      <div className="page-header">
        <h1>{id ? 'Edit Book' : 'Add New Book'}</h1>
        <p>{id ? 'Update book information' : 'Add a new book to the library collection'}</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">ISBN *</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Publisher</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Publication Year</label>
            <input
              type="number"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              className="form-input"
              min="1000"
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Total Copies</label>
            <input
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              className="form-input"
              min="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Available Copies</label>
            <input
              type="number"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleChange}
              className="form-input"
              min="0"
              max={formData.totalCopies}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cover Image URL</label>
          <input
            type="url"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/cover.jpg"
          />
        </div>

        {formData.coverImage && (
          <div className="form-group">
            <label className="form-label">Cover Preview</label>
            <img
              src={formData.coverImage}
              alt="Book cover preview"
              className="cover-preview"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/books')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Saving...' : (id ? 'Update Book' : 'Add Book')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;
