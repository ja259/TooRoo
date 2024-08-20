import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Following.css';

const Following = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFollowingVideos = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

                if (!token) {
                    setError('You are not authenticated. Please log in.');
                    navigate('/login'); // Redirect to login if no token is found
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/posts/following-videos', {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the Authorization header
                    }
                });

                setVideos(response.data.videos);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setError('Unauthorized access. Please log in.');
                    navigate('/login'); // Redirect to login on unauthorized access
                } else {
                    setError('Error fetching videos');
                    console.error('Error fetching videos:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFollowingVideos();
    }, [navigate]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="following-videos">
            {videos.map((video) => (
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

export default Following;
