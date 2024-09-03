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

        try {
            const response = await authService.login(emailOrPhone, password);
            console.log('Login response:', response); // Log the full response for debugging

            if (response.success && response.data) {
                const user = response.data.user;

                if (!user) {
                    setError('Login failed. User data is missing.');
                    console.error('User data is missing in the response:', response.data);
                    return;
                }

                // Store the JWT token and user data in localStorage
                localStorage.setItem('user', JSON.stringify(response.data));

                // Redirect based on user status
                if (user.newUser) {
                    navigate('/terms-and-policies');
                } else if (user.twoFactorEnabled) {
                    navigate('/two-factor-auth', { state: { userId: user._id } });
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(response.message || 'Login failed.');
                console.error('Login failed. Response:', response);
            }
        } catch (error) {
            setError('An error occurred during login. Please try again.');
            console.error('Login error:', error);
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
