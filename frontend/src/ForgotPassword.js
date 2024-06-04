import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Add logic to handle forgot password
      await axios.post('http://localhost:5000/forgot-password', { email });
      alert('Password reset link has been sent to your email.');
    } catch (error) {
      console.error(error);
      alert('Failed to send password reset link. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ForgotPassword;
