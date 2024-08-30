import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import './DarkModeToggle.css';

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedMode = JSON.parse(localStorage.getItem('darkMode'));
        if (savedMode) {
            setDarkMode(savedMode);
            document.body.classList.add('dark-mode');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        document.body.classList.toggle('dark-mode', newMode);
        localStorage.setItem('darkMode', JSON.stringify(newMode));
    };

    const handleNext = () => {
        navigate('/dashboard');
    };

    return (
        <div className="dark-mode-toggle-container">
            <h2>Toggle Dark Mode</h2>
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
                {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <button onClick={handleNext}>Next</button>
        </div>
    );
};

export default DarkModeToggle;
