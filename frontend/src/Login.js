import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from './services/authService';
import logo from './logo.png';
import './Login.css';

const Login = () => {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (!emailOrPhone || !password) {
            setError('Please fill in all fields');
            return;
        }

        const response = await authService.login(emailOrPhone, password);
        if (response.success) {
            navigate('/dashboard'); // Redirect to the dashboard or another protected route
        } else {
            setError(response.message);
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="TooRoo Logo" className="logo" />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Email or Phone"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Login</button>
                {error && <div className="error-message">{error}</div>}
                <div>
                    <Link to="/forgot-password">Forgot your password?</Link>
                    <br />
                    <Link to="/register">Create a new account</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
