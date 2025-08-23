import React, { useState } from "react";
import api from '../../services/api';

const BorrowerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.addBorrower(formData);
    alert("Borrower added successfully!");
    setFormData({ name: "", email: "", phone: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="borrowerName">Name</label>
        <input
          id="borrowerName"
          name="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="borrowerEmail">Email</label>
        <input
          id="borrowerEmail"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="borrowerPhone">Phone</label>
        <input
          id="borrowerPhone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          autoComplete="tel"
        />
      </div>

      <button type="submit">Add Borrower</button>
    </form>
  );
};

export default BorrowerForm;
