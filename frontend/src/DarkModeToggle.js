import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import './DarkModeToggle.css';

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
    useEffect(() => {
        const savedMode = JSON.parse(localStorage.getItem('darkMode'));
        if (savedMode) {
            setDarkMode(savedMode);
            document.body.classList.add('dark-mode');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', JSON.stringify(!darkMode));
    };

    return (
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
        </button>
    );
};

export default DarkModeToggle;
