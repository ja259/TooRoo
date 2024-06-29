import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-mode');
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            <div className="settings-item">
                <label>Dark Mode</label>
                <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            </div>
            <div className="settings-item">
                <label>Notification Preferences</label>
                <button>Manage</button>
            </div>
            <div className="settings-item">
                <label>Privacy Settings</label>
                <button>Manage</button>
            </div>
            <div className="settings-item">
                <label>Language</label>
                <button>Manage</button>
            </div>
        </div>
    );
};

export default Settings;
