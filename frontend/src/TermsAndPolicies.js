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
                Welcome to TooRoo! Please read these Terms and Policies carefully before using our social media platform.
            </p>
            <h3>1. Acceptance of Terms</h3>
            <p>
                By accessing or using TooRoo, you agree to be bound by these terms and conditions and our Privacy Policy.
                If you do not agree with any part of the terms, you must not use our services.
            </p>
            <h3>2. User Accounts</h3>
            <p>
                To use TooRoo, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
                You must notify us immediately of any unauthorized use of your account.
            </p>
            <h3>3. User Conduct</h3>
            <p>
                You agree not to use TooRoo for any unlawful purpose or in any way that could harm or disable the platform.
                You must not upload or share content that is offensive, defamatory, or infringes on intellectual property rights.
            </p>
            <h3>4. Content Ownership</h3>
            <p>
                You retain ownership of the content you upload to TooRoo. However, by uploading content, you grant TooRoo a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content.
            </p>
            <h3>5. Privacy Policy</h3>
            <p>
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
            </p>
            <h3>6. Termination</h3>
            <p>
                We reserve the right to terminate or suspend your account at any time, without prior notice, for conduct that we believe violates these terms or is harmful to other users.
            </p>
            <h3>7. Changes to Terms</h3>
            <p>
                We may update these terms from time to time. We will notify you of any changes by posting the new terms on our platform. Your continued use of TooRoo after any changes constitutes your acceptance of the new terms.
            </p>
            <h3>8. Contact Us</h3>
            <p>
                If you have any questions about these Terms and Policies, please contact us at support@tooroo.com.
            </p>
            <div className="buttons">
                <button onClick={handleAgree}>Agree</button>
                <button onClick={handleDecline}>Decline</button>
            </div>
        </div>
    );
};

export default TermsAndPolicies;

