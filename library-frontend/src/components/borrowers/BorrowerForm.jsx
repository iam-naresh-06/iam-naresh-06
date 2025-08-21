// src/components/borrowers/BorrowerForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import borrowerService from '../../services/borrowerService'; // Default import
import LoadingSpinner from '../common/LoadingSpinner';

const BorrowerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    libraryCardNumber: '',
    membershipType: 'STANDARD',
    isActive: true
  });

  // Generates a random library card number and updates the form data
  const generateLibraryCardNumber = () => {
    const randomNumber = 'LIB' + Math.floor(100000 + Math.random() * 900000);
    setFormData(prev => ({
      ...prev,
      libraryCardNumber: randomNumber
    }));
  };

  useEffect(() => {
    if (id) {
      loadBorrower();
    } else {
      generateLibraryCardNumber();
    }
  }, [id]);

  const loadBorrower = async () => {
    try {
      setLoading(true);
      // Use borrowerService.getBorrowerById() instead of getBorrowerById()
      const borrower = await borrowerService.getBorrowerById(id);
      setFormData(borrower);
    } catch (err) {
      setError('Failed to load borrower');
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
        // Use borrowerService.updateBorrower() instead of updateBorrower()
        await borrowerService.updateBorrower(id, formData);
        setSuccess('Borrower updated successfully');
      } else {
        // Use borrowerService.createBorrower() instead of createBorrower()
        await borrowerService.createBorrower(formData);
        setSuccess('Borrower created successfully');
      }
      
      setTimeout(() => {
        navigate('/borrowers');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save borrower');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="form-container">
      <div className="page-header">
        <h1>{id ? 'Edit Borrower' : 'Add New Borrower'}</h1>
        <p>{id ? 'Update borrower information' : 'Add a new library member'}</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-input"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Library Card Number</label>
            <input
              type="text"
              name="libraryCardNumber"
              value={formData.libraryCardNumber}
              onChange={handleChange}
              className="form-input"
              required
            />
            <button
              type="button"
              onClick={generateLibraryCardNumber}
              className="btn btn-sm btn-secondary"
            >
              Generate New
            </button>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Membership Type</label>
            <select
              name="membershipType"
              value={formData.membershipType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="STANDARD">Standard</option>
              <option value="PREMIUM">Premium</option>
              <option value="STUDENT">Student</option>
              <option value="SENIOR">Senior</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-checkbox">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Active Member
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/borrowers')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? 'Saving...' : (id ? 'Update Borrower' : 'Add Borrower')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BorrowerForm;
