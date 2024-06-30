import React, { useState } from 'react';
import './Settings.css';

const Settings = ({ setDarkMode }) => {
    const [darkMode, setDarkModeState] = useState(false);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkModeState(newDarkMode);
        setDarkMode(newDarkMode);
        document.body.classList.toggle('dark-mode', newDarkMode);
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
