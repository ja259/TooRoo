import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png'; // Adjust the path to your logo
import './Login.css'; // Assuming you have a CSS file for styling

const Login = ({ onLogin }) => {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await onLogin(emailOrPhone, password); // Make sure onLogin is passed correctly
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="TooRoo Logo" className="logo" />
            <form onSubmit={handleSubmit} className="login-form">
                <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Email or Phone"
                    required
                    className="login-input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="login-input"
                />
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button">Login</button>
                <div className="login-links">
                    <Link to="/forgot-password" className="login-link">Forgot your password?</Link>
                    <br />
                    <Link to="/register" className="login-link">Create a new account</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
