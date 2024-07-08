import React, { useState } from 'react';
import { FaLanguage } from 'react-icons/fa';
import axios from 'axios';
import './Translation.css';

const Translation = () => {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');

    const handleTranslate = async () => {
        try {
            const response = await axios.post('https://api.example.com/translate', { text });
            setTranslatedText(response.data.translatedText);
        } catch (error) {
            console.error('Error translating text:', error);
        }
    };

    return (
        <div className="translation">
            <h2>Translation</h2>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to translate"
            />
            <button onClick={handleTranslate}><FaLanguage /> Translate</button>
            {translatedText && (
                <div className="translated-text">
                    <p>{translatedText}</p>
                </div>
            )}
        </div>
    );
};

export default Translation;
