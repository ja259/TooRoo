import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';  // Adjust the path to your logo

const Login = ({ onLogin }) => {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onLogin(emailOrPhone, password);
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
