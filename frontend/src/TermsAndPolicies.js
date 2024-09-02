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
            <p>Last Updated: [Date]</p>
            <p>
                Welcome to TooRoo! These Terms and Policies (collectively, "Terms") govern your use of the TooRoo platform, including our website, mobile application, and any related services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. Please read them carefully.
            </p>

            <h3>1. Introduction</h3>
            <p>
                <strong>Overview:</strong> TooRoo is a social media platform designed to connect users through content sharing, live events, virtual interactions, and more.
            </p>
            <p>
                <strong>Eligibility:</strong> To use TooRoo, you must be at least 13 years old. By using the Services, you confirm that you meet this requirement.
            </p>

            <h3>2. Account Creation and Security</h3>
            <p>
                <strong>Registration:</strong> You must create an account to access certain features. You agree to provide accurate and complete information during registration and to keep your account information up-to-date.
            </p>
            <p>
                <strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Notify TooRoo immediately if you suspect any unauthorized use of your account.
            </p>
            <p>
                <strong>Two-Factor Authentication:</strong> We recommend enabling Two-Factor Authentication (2FA) for added security.
            </p>

            <h3>3. User Conduct</h3>
            <p>
                <strong>Community Guidelines:</strong> You agree to use TooRoo in a respectful manner. Harassment, hate speech, and any form of harmful behavior are strictly prohibited.
            </p>
            <p>
                <strong>Content Ownership:</strong> You retain ownership of the content you post on TooRoo. However, by posting content, you grant TooRoo a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, display, and distribute your content on the platform.
            </p>
            <p>
                <strong>Prohibited Content:</strong> You may not post content that is illegal, offensive, or violates the rights of others. This includes, but is not limited to, defamatory, obscene, or infringing content.
            </p>

            <h3>4. Privacy Policy</h3>
            <p>
                <strong>Data Collection:</strong> We collect various types of information, including personal information, usage data, and content you create or upload.
            </p>
            <p>
                <strong>Data Usage:</strong> Your data is used to provide, improve, and personalize our Services. We may also use your data for advertising and marketing purposes.
            </p>
            <p>
                <strong>Third-Party Sharing:</strong> We may share your data with third parties under certain circumstances, such as with service providers, for legal reasons, or with your consent.
            </p>
            <p>
                <strong>Data Security:</strong> We implement security measures to protect your data, but we cannot guarantee its absolute security.
            </p>

            <h3>5. Intellectual Property</h3>
            <p>
                <strong>TooRoo's IP:</strong> All intellectual property rights related to the Services, including trademarks, logos, and software, are owned by TooRoo or its licensors.
            </p>
            <p>
                <strong>User Content:</strong> By posting content on TooRoo, you affirm that you have the rights to share that content and grant TooRoo the rights outlined in these Terms.
            </p>

            <h3>6. Content Moderation</h3>
            <p>
                <strong>Review and Removal:</strong> TooRoo reserves the right to review and remove any content that violates these Terms or is otherwise deemed inappropriate.
            </p>
            <p>
                <strong>Reporting Violations:</strong> Users can report content or behavior that they believe violates our policies. TooRoo will investigate and take appropriate action.
            </p>

            <h3>7. Advertising and Sponsored Content</h3>
            <p>
                <strong>Advertisements:</strong> TooRoo may display advertisements and sponsored content. These ads are selected based on user data and preferences.
            </p>
            <p>
                <strong>Sponsored Content:</strong> Users may create sponsored content, but it must comply with all applicable laws and our Advertising Policies.
            </p>

            <h3>8. Monetization</h3>
            <p>
                <strong>Content Monetization:</strong> TooRoo may offer opportunities for users to monetize their content. Participation in these programs is subject to specific terms and eligibility requirements.
            </p>
            <p>
                <strong>Payment Terms:</strong> If you participate in monetization programs, you agree to our payment terms, including revenue sharing, payout schedules, and tax obligations.
            </p>

            <h3>9. User Interactions and Transactions</h3>
            <p>
                <strong>Marketplace:</strong> TooRoo may offer a marketplace for buying and selling goods or services. TooRoo is not responsible for transactions between users and does not guarantee the quality or legality of items sold.
            </p>
            <p>
                <strong>Virtual Goods:</strong> Users may purchase virtual goods or currency within TooRoo. These purchases are final and non-refundable.
            </p>

            <h3>10. Location Sharing</h3>
            <p>
                <strong>Location Data:</strong> If you enable location-sharing features, TooRoo may collect and share your location data with other users or third-party services.
            </p>
            <p>
                <strong>User Control:</strong> You can control the sharing of your location data through your account settings.
            </p>

            <h3>11. Third-Party Integrations</h3>
            <p>
                <strong>External Services:</strong> TooRoo may integrate with third-party services. Your use of these services is subject to their respective terms and privacy policies.
            </p>
            <p>
                <strong>Third-Party Content:</strong> TooRoo is not responsible for content provided by third parties and does not endorse or assume any liability for such content.
            </p>

            <h3>12. Changes to the Terms and Policies</h3>
            <p>
                <strong>Updates:</strong> TooRoo may update these Terms from time to time. We will notify you of significant changes, and your continued use of the Services constitutes acceptance of the updated terms.
            </p>
            <p>
                <strong>Review:</strong> We encourage you to review these Terms periodically to stay informed about our practices.
            </p>

            <h3>13. Termination and Suspension</h3>
            <p>
                <strong>Termination by User:</strong> You may terminate your account at any time by following the instructions in your account settings.
            </p>
            <p>
                <strong>Termination by TooRoo:</strong> TooRoo reserves the right to suspend or terminate your account if you violate these Terms or engage in any behavior that is harmful to the community.
            </p>
            <p>
                <strong>Effect of Termination:</strong> Upon termination, your right to access and use the Services will immediately cease. TooRoo may retain your content and data as required by law or for legitimate business purposes.
            </p>

            <h3>14. Dispute Resolution</h3>
            <p>
                <strong>Governing Law:</strong> These Terms are governed by the laws of [Your Jurisdiction].
            </p>
            <p>
                <strong>Arbitration:</strong> Any disputes arising from or relating to these Terms will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>
            <p>
                <strong>Class Action Waiver:</strong> You agree to resolve any disputes on an individual basis and waive the right to participate in a class action lawsuit.
            </p>

            <h3>15. Contact Information</h3>
            <p>
                <strong>Support:</strong> For any questions or concerns about these Terms or the Services, you can contact us at [Support Email].
            </p>
            <p>
                <strong>Notice:</strong> All legal notices should be sent to [Legal Email or Address].
            </p>

            <h3>16. Miscellaneous</h3>
            <p>
                <strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and TooRoo and supersede any prior agreements or understandings.
            </p>
            <p>
                <strong>Severability:</strong> If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
            </p>
            <p>
                <strong>Waiver:</strong> TooRoo's failure to enforce any right or provision of these Terms will not constitute a waiver of such right or provision.
            </p>

            <div className="buttons">
                <button onClick={handleAgree}>Agree</button>
                <button onClick={handleDecline}>Decline</button>
            </div>
        </div>
    );
};

export default TermsAndPolicies;
