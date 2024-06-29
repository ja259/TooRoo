import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsAndPolicies.css';

const TermsAndPolicies = () => {
    const navigate = useNavigate();

    const handleAgree = () => {
        navigate('/add-profile-picture'); // Redirect to the add profile picture page
    };

    const handleDecline = () => {
        navigate('/register'); // Redirect back to the registration page
    };

    return (
        <div className="terms-and-policies">
            <h2>Terms and Policies</h2>
            <p>
                {/* Complete terms and policies content */}
            </p>
            <div className="buttons">
                <button onClick={handleAgree}>Agree</button>
                <button onClick={handleDecline}>Decline</button>
            </div>
        </div>
    );
};

export default TermsAndPolicies;
