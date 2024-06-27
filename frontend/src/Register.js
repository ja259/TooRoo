import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from './services/authService';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestions, setSecurityQuestions] = useState([
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' }
  ]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await authService.register(username, email, phone, password, securityQuestions);
    if (response.success) {
      navigate('/login'); // Redirect to the login page
    } else {
      setError(response.message);
    }
  };

  const handleSecurityQuestionChange = (index, field, value) => {
    const newQuestions = [...securityQuestions];
    newQuestions[index][field] = value;
    setSecurityQuestions(newQuestions);
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        {securityQuestions.map((question, index) => (
          <div key={index} className="security-question">
            <input
              type="text"
              value={question.question}
              onChange={(e) => handleSecurityQuestionChange(index, 'question', e.target.value)}
              placeholder={`Security Question ${index + 1}`}
              required
            />
            <input
              type="text"
              value={question.answer}
              onChange={(e) => handleSecurityQuestionChange(index, 'answer', e.target.value)}
              placeholder="Answer"
              required
            />
          </div>
        ))}
        <button type="submit">Register</button>
        <div>
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
