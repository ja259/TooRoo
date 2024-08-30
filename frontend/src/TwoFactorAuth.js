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
                localStorage.setItem('user', JSON.stringify(response.data));
                navigate('/toggle-dark-mode');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        }
    };

    const handleSkip = () => {
        navigate('/toggle-dark-mode');
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
                <button type="button" onClick={handleSkip}>Skip</button>
            </form>
        </div>
    );
};

export default TwoFactorAuth;

