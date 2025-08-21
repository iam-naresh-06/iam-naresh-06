import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../../services/bookService';

const BookForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publicationYear: '',
    genre: '',
    publisher: '',
    description: '',
    totalCopies: 1,
    availableCopies: 1,
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await bookService.createBook(formData);
      navigate('/books');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form">
      <div className="page-header">
        <h1>Add New Book</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-row">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>ISBN *</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Publication Year *</label>
            <input
              type="number"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              required
              min="1000"
              max="2025"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Publisher</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Total Copies *</label>
            <input
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
          
          <div className="form-group">
            <label>Available Copies *</label>
            <input
              type="number"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleChange}
              required
              min="0"
              max={formData.totalCopies}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Shelf location"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Book description..."
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/books')} className="secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding Book...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;