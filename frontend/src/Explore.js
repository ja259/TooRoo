import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Explore.css';

const Explore = () => {
    const [content, setContent] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/explore');
                setContent(response.data);
            } catch (err) {
                setError('Failed to fetch content');
            }
        };
        fetchContent();
    }, []);

    return (
        <div className="explore-container">
            <h1>Explore</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="explore-content">
                {content.map(item => (
                    <div key={item.id} className="explore-item">
                        <img src={item.image} alt={item.title} />
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Explore;
