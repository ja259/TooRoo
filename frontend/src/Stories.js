import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Stories.css';

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/stories');
                setStories(response.data);
            } catch (error) {
                setError('Error fetching stories');
                console.error('Error fetching stories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="stories-container">
            {stories.map((story) => (
                <div key={story._id} className="story">
                    <img src={story.imageUrl} alt="story" className="story-image" />
                    <p className="story-author">{story.author.username}</p>
                </div>
            ))}
        </div>
    );
};

export default Stories;
