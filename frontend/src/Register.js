import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from './services/authService';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    birthdate: '',
    gender: '',
    phone: '',
    securityQuestion1: '',
    securityAnswer1: '',
    securityQuestion2: '',
    securityAnswer2: '',
    securityQuestion3: '',
    securityAnswer3: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await authService.register(formData);
    if (response.success) {
      navigate('/login'); // Redirect to the login page
    } else {
      setError(response.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" required />
        <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} placeholder="Birthdate" required />
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required />
        <input type="text" name="securityQuestion1" value={formData.securityQuestion1} onChange={handleChange} placeholder="Security Question 1" required />
        <input type="text" name="securityAnswer1" value={formData.securityAnswer1} onChange={handleChange} placeholder="Answer 1" required />
        <input type="text" name="securityQuestion2" value={formData.securityQuestion2} onChange={handleChange} placeholder="Security Question 2" required />
        <input type="text" name="securityAnswer2" value={formData.securityAnswer2} onChange={handleChange} placeholder="Answer 2" required />
        <input type="text" name="securityQuestion3" value={formData.securityQuestion3} onChange={handleChange} placeholder="Security Question 3" required />
        <input type="text" name="securityAnswer3" value={formData.securityAnswer3} onChange={handleChange} placeholder="Answer 3" required />
        <button type="submit">Register</button>
        <div>
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
