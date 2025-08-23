import React, { useState } from "react";
import api from '../../services/api';

const BookForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publicationYear: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.author) newErrors.author = "Author is required";
    if (!formData.isbn) newErrors.isbn = "ISBN is required";
    if (!formData.publicationYear) newErrors.publicationYear = "Publication year is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    await api.addBook(formData);
    alert("Book added successfully!");
    setFormData({ title: "", author: "", isbn: "", publicationYear: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          autoComplete="off"
        />
        {errors.title && <span>{errors.title}</span>}
      </div>

      <div>
        <label htmlFor="author">Author</label>
        <input
          id="author"
          name="author"
          type="text"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          autoComplete="name"
        />
        {errors.author && <span>{errors.author}</span>}
      </div>

      <div>
        <label htmlFor="isbn">ISBN</label>
        <input
          id="isbn"
          name="isbn"
          type="text"
          value={formData.isbn}
          onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
          autoComplete="off"
        />
        {errors.isbn && <span>{errors.isbn}</span>}
      </div>

      <div>
        <label htmlFor="publicationYear">Publication Year</label>
        <input
          id="publicationYear"
          name="publicationYear"
          type="number"
          value={formData.publicationYear}
          onChange={(e) =>
            setFormData({ ...formData, publicationYear: e.target.value })
          }
          autoComplete="off"
        />
        {errors.publicationYear && <span>{errors.publicationYear}</span>}
      </div>

      <button type="submit">Add Book</button>
    </form>
  );
};

export default BookForm;
