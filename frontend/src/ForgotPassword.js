import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await authService.forgotPassword(email);
            if (response.success) {
                setMessage(response.message);
                setError('');
            } else {
                setError(response.message);
                setMessage('');
            }
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
