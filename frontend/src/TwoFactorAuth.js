import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './TwoFactorAuth.css';

const TwoFactorAuth = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { userId } = location.state;
            const response = await axios.post('http://localhost:5000/api/auth/verify-2fa', { userId, twoFactorCode: code });

            if (response.data.success) {
                // Store the JWT token and user data in localStorage
                localStorage.setItem('user', JSON.stringify(response.data));
                
                // Redirect the user after successful 2FA verification
                if (response.data.user.newUser) {
                    navigate('/terms-and-policies'); // Redirect new users to terms and policies
                } else {
                    navigate('/dashboard'); // Redirect existing users to dashboard
                }
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        }
    };

    return (
        <div className="two-factor-auth-container">
            <h2>Two-Factor Authentication</h2>
            <form onSubmit={handleVerify}>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter your 2FA code"
                    required
                />
                <button type="submit">Verify</button>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

export default TwoFactorAuth;

