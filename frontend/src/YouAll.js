import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './YouAll.css';

const YouAll = () => {
    const [videos, setVideos] = useState([]);
    const [liveVideos, setLiveVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const token = localStorage.getItem('authToken');

                if (!token) {
                    setError('You are not authenticated. Please log in.');
                    navigate('/login');
                    return;
                }

                const [allVideosResponse, liveVideosResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/media/you-all-videos', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    axios.get('http://localhost:5000/api/live-videos', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                ]);

                setVideos(allVideosResponse.data.videos);
                setLiveVideos(liveVideosResponse.data.videos);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setError('Unauthorized access. Please log in.');
                    navigate('/login');
                } else {
                    setError('Error fetching videos');
                    console.error('Error fetching videos:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [navigate]);

    const handleJoinLive = (liveVideo) => {
        navigate(`/live/${liveVideo._id}`);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="you-all">
            {liveVideos.length > 0 && (
                <div className="live-section">
                    <h3>Live Now</h3>
                    {liveVideos.map((liveVideo) => (
                        <div key={liveVideo._id} className="live-container" onClick={() => handleJoinLive(liveVideo)}>
                            <video autoPlay muted src={liveVideo.url} className="live-content"></video>
                            <div className="live-info">
                                <img src={liveVideo.author.avatar} alt="avatar" className="avatar" />
                                <div className="live-details">
                                    <h4>{liveVideo.author.username}</h4>
                                    <p>{liveVideo.title}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
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

export default YouAll;
