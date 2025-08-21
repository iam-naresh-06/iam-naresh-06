import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { borrowerService } from '../../services/borrowerService';

const BorrowerForm = () => {
  const [formData, setFormData] = useState({
    userId: '',
    membershipType: 'STANDARD',
    emergencyContact: ''
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
      await borrowerService.createBorrower(formData);
      navigate('/borrowers');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create borrower');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="borrower-form">
      <div className="page-header">
        <h1>Register New Borrower</h1>
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>User ID *</label>
          <input
            type="number"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
            placeholder="Enter user ID"
          />
        </div>

        <div className="form-group">
          <label>Membership Type *</label>
          <select
            name="membershipType"
            value={formData.membershipType}
            onChange={handleChange}
            required
          >
            <option value="STANDARD">Standard</option>
            <option value="PREMIUM">Premium</option>
            <option value="STUDENT">Student</option>
            <option value="FACULTY">Faculty</option>
          </select>
        </div>

        <div className="form-group">
          <label>Emergency Contact</label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Emergency contact information"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/borrowers')} className="secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register Borrower'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BorrowerForm;