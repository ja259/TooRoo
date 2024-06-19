import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; // Ensure you create a CSS file for styling

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage('Password reset link has been sent to your email.');
            setError('');
        } catch (error) {
            console.error(error);
            setError('Failed to send password reset link. Please try again.');
            setMessage('');
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
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
        </div>
    );
};

export default ForgotPassword;
