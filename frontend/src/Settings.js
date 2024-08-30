import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = ({ setDarkMode, user }) => {
    const [darkMode, setDarkModeState] = useState(false);
    const [enable2FA, setEnable2FA] = useState(false);
    const [preferred2FAMethod, setPreferred2FAMethod] = useState('email');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch user's settings from the server
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${user._id}/settings`);
                setDarkModeState(response.data.darkMode);
                setEnable2FA(response.data.enable2FA);
                setPreferred2FAMethod(response.data.preferred2FAMethod || 'email');
            } catch (err) {
                console.error('Failed to fetch settings:', err);
            }
        };

        fetchSettings();
    }, [user]);

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkModeState(newDarkMode);
        setDarkMode(newDarkMode);
        document.body.classList.toggle('dark-mode', newDarkMode);
        updateSettings({ darkMode: newDarkMode });
    };

    const toggle2FA = () => {
        const newEnable2FA = !enable2FA;
        setEnable2FA(newEnable2FA);
        updateSettings({ enable2FA: newEnable2FA });
    };

    const updateSettings = async (settings) => {
        try {
            setLoading(true);
            await axios.put(`http://localhost:5000/api/users/${user._id}/settings`, settings);
            setLoading(false);
        } catch (err) {
            setError('Failed to update settings. Please try again.');
            setLoading(false);
        }
    };

    const handle2FAMethodChange = (e) => {
        const method = e.target.value;
        setPreferred2FAMethod(method);
        updateSettings({ preferred2FAMethod: method });
    };

    return (
        <div className="settings-container">
            <h1>Settings</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="settings-item">
                <label>Dark Mode</label>
                <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            </div>
            <div className="settings-item">
                <label>Enable Two-Factor Authentication (2FA)</label>
                <input type="checkbox" checked={enable2FA} onChange={toggle2FA} />
            </div>
            {enable2FA && (
                <div className="settings-item">
                    <label>Preferred 2FA Method</label>
                    <select value={preferred2FAMethod} onChange={handle2FAMethodChange}>
                        <option value="email">Email</option>
                        <option value="sms">SMS/Text</option>
                        <option value="both">Both Email and SMS</option>
                    </select>
                </div>
            )}
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
            {loading && <div className="loading-message">Saving settings...</div>}
        </div>
    );
};

export default Settings;
