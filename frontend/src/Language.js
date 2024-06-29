import React, { useState } from 'react';
import './Language.css';

const Language = ({ user, onUpdateLanguage }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(user.language);

    const handleChange = (e) => {
        const newLanguage = e.target.value;
        setSelectedLanguage(newLanguage);
        onUpdateLanguage(newLanguage);
    };

    return (
        <div className="language-container">
            <h1>Language Settings</h1>
            <select value={selectedLanguage} onChange={handleChange}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
            </select>
        </div>
    );
};

export default Language;
