import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TwoFactorAuth.css';

const TwoFactorAuth = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/verify-2fa', { code });
            if (response.data.success) {
                navigate('/dashboard');
            } else {
                setError('Invalid code. Please try again.');
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
                    placeholder="Enter the verification code"
                    required
                />
                <button type="submit">Verify</button>
                {error && <div className="error-message">{error}</div>}
            </form>
        </div>
    );
};

export default TwoFactorAuth;
