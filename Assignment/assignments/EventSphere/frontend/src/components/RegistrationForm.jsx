import React, { useState } from 'react';
import './RegistrationForm.css';

const RegistrationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    event: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log('Form Submitted:', formData);
    }

    setFormData({ name: '', email: '', event: '' });
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        placeholder="Your Name"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="event"
        value={formData.event}
        placeholder="Event Name"
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
