// Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from './services/authService';
import './Register.css';

const securityQuestionsList = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the make and model of your first car?",
    "In what city were you born?",
    "What was the name of your elementary school?",
    "What was the name of your best childhood friend?",
    "What was the name of the street you grew up on?",
    "What was your first job?",
    "What is the name of your favorite teacher?",
    "What is the name of your favorite childhood book?"
];

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+1');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([null, null, null]);
    const [answers, setAnswers] = useState(['', '', '']);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (selectedQuestions.includes(null)) {
            setError('Please select and answer all three security questions');
            return;
        }

        const securityQuestions = selectedQuestions.map((question, index) => ({
            question,
            answer: answers[index]
        }));

        const response = await authService.register(username, email, `${countryCode}${phone}`, password, securityQuestions);
        if (response.success) {
            navigate('/terms-and-policies'); // Redirect to the terms and policies page
        } else {
            setError(response.message);
        }
    };

    const handleSecurityQuestionChange = (index, value) => {
        const updatedQuestions = [...selectedQuestions];
        updatedQuestions[index] = value;
        setSelectedQuestions(updatedQuestions);
    };

    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    return (
        <div className="register-container">
            <h2>Create an Account</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <div className="phone-input">
                    <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="country-code">
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+91">+91 (IN)</option>
                        {/* Add more country codes as needed */}
                    </select>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone Number"
                        required
                    />
                </div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                />

                {securityQuestionsList.slice(0, 3).map((_, index) => (
                    <div key={index} className="security-question">
                        <select
                            value={selectedQuestions[index]}
                            onChange={(e) => handleSecurityQuestionChange(index, e.target.value)}
                            required
                        >
                            <option value="">Select a security question</option>
                            {securityQuestionsList.map((question, i) => (
                                <option key={i} value={question}>{question}</option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={answers[index]}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            placeholder="Answer"
                            required
                        />
                    </div>
                ))}

                <button type="submit">Register</button>
                <div>
                    <Link to="/login">Already have an account? Login</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
