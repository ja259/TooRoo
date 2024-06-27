import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './YouAll.css';

const YouAll = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/media/you-all-videos');
                setVideos(response.data.videos);
            } catch (error) {
                setError('Error fetching videos');
                console.error('Error fetching videos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="you-all">
            {videos.map(video => (
                <div key={video._id} className="video-container">
                    <video controls src={`http://localhost:5000/videos/${video.videoUrl}`} className="video-content"></video>
                    <div className="video-details">
                        <img src={video.author.avatar} alt="avatar" className="avatar" />
                        <div className="video-info">
                            <h4>{video.author.username}</h4>
                            <p>{video.description}</p>
                        </div>
                        <div className="video-stats">
                            <span>{video.likes.length} ❤️</span>
                            <span>{video.comments.length} 💬</span>
                            <span>{video.shares} ↪️</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default YouAll;
