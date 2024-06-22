import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            setSuccess('Password has been reset. You can now ');
        } catch (error) {
            console.error(error);
            setError('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Your Password</h2>
            {error && <p className="error-message">{error}</p>}
            {success ? (
                <p className="success-message">{success}<Link to="/login">login</Link>.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New Password"
                        required
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        required
                    />
                    <button type="submit">Reset Password</button>
                </form>
            )}
        </div>
    );
};

export default ResetPassword;

