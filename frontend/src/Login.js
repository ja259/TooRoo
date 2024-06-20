import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png'; // Adjust the path to your logo
import './Login.css'; // Import the CSS for styling

const Login = ({ onLogin }) => {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (emailOrPhone && password) {
            setErrorMessage('');
            onLogin(emailOrPhone, password);  // Ensure onLogin is passed correctly
        } else {
            setErrorMessage('Please fill in all fields');
        }
    };

    return (
        <div className="login-container">
            <img src={logo} alt="TooRoo Logo" className="logo" />
            <form onSubmit={handleSubmit}>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
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
