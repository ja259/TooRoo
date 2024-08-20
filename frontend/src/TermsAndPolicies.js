import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsAndPolicies.css';

const TermsAndPolicies = () => {
    const navigate = useNavigate();

    const handleAgree = () => {
        navigate('/add-profile-picture'); // Redirect to the add profile picture page
    };

    const handleDecline = () => {
        navigate('/login'); // Redirect to the login page
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
            <h3>8. Payment and Subscriptions</h3>
            <p>
                TooRoo may offer paid services or subscriptions. If you choose to purchase a service or subscription, you agree to pay the applicable fees. All payments are non-refundable except as required by law.
            </p>
            <h3>9. Third-Party Links</h3>
            <p>
                TooRoo may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <h3>10. Limitation of Liability</h3>
            <p>
                To the maximum extent permitted by law, TooRoo shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the platform.
            </p>
            <h3>11. Governing Law</h3>
            <p>
                These terms shall be governed and construed in accordance with the laws of the jurisdiction in which TooRoo operates, without regard to its conflict of law provisions.
            </p>
            <h3>12. Dispute Resolution</h3>
            <p>
                Any disputes arising out of or relating to these terms or your use of TooRoo shall be resolved through binding arbitration conducted in accordance with the arbitration rules of the jurisdiction in which TooRoo operates.
            </p>
            <h3>13. Severability</h3>
            <p>
                If any provision of these terms is found to be invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect.
            </p>
            <h3>14. Entire Agreement</h3>
            <p>
                These terms, along with our Privacy Policy, constitute the entire agreement between you and TooRoo regarding your use of the platform and supersede any prior agreements.
            </p>
            <h3>15. Contact Us</h3>
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
