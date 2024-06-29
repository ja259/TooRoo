import React from 'react';
import './Privacy.css';

const Privacy = () => {
    return (
        <div className="privacy-container">
            <h1>Privacy Settings</h1>
            <div className="privacy-item">
                <label>Profile Visibility</label>
                <select>
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                </select>
            </div>
            <div className="privacy-item">
                <label>Block List</label>
                <button>Manage</button>
            </div>
            <div className="privacy-item">
                <label>Activity Status</label>
                <input type="checkbox" />
            </div>
        </div>
    );
};

export default Privacy;
