import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Live.css';

const Live = ({ user }) => {
    const [liveVideos, setLiveVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLive, setIsLive] = useState(false);
    const [viewers, setViewers] = useState([]);
    const [comments, setComments] = useState([]);
    const [currentLiveVideo, setCurrentLiveVideo] = useState(null);

    useEffect(() => {
        const fetchLiveVideos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/live-videos');
                setLiveVideos(response.data.videos);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError('No live videos found.');
                } else {
                    setError('Failed to fetch live videos.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLiveVideos();
    }, []);

    const handleGoLive = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/live/start', {
                userId: user._id,  // Ensure user object has _id
                title: `${user.username}'s Live Stream`,
                url: 'http://localhost:5000/live-stream-url', // Replace with the actual live stream URL
            });
            setIsLive(true);
            setCurrentLiveVideo(response.data.liveVideo);
            setLiveVideos([...liveVideos, response.data.liveVideo]);
        } catch (err) {
            console.error('Failed to start live video:', err);
        }
    };

    const handleEndLive = async () => {
        setIsLive(false);

        if (currentLiveVideo) {
            try {
                await axios.put(`http://localhost:5000/api/live/end/${currentLiveVideo._id}`);
                setCurrentLiveVideo(null);
            } catch (err) {
                console.error('Failed to end live video:', err);
            }
        }

        // Additional logic to stop the live session on the server can be added here
    };

    const handleSendComment = async (comment) => {
        try {
            const response = await axios.post('http://localhost:5000/api/live/comment', {
                userId: user._id,
                comment,
            });
            setComments([...comments, response.data.comment]);
        } catch (err) {
            console.error('Failed to send comment:', err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (isLive) {
        return (
            <div className="live-session">
                <video className="live-video-feed" autoPlay muted controls />
                <div className="live-info">
                    <div className="live-header">
                        <h1>Live: {user.username}</h1>
                        <button className="end-live-button" onClick={handleEndLive}>End Live</button>
                    </div>
                    <div className="live-interactions">
                        <div className="live-viewers">
                            <h3>Viewers</h3>
                            <ul>
                                {viewers.map(viewer => (
                                    <li key={viewer.id}>{viewer.username}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="live-comments">
                            <h3>Comments</h3>
                            <ul>
                                {comments.map((comment, index) => (
                                    <li key={index}>{comment}</li>
                                ))}
                            </ul>
                            <div className="comment-input">
                                <input type="text" placeholder="Add a comment" onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSendComment(e.target.value);
                                        e.target.value = '';
                                    }
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="live">
            <div className="live-header">
                <h1><span role="img" aria-label="Live">🔴</span> Live Videos</h1>
                <button className="go-live-button" onClick={handleGoLive}>Go Live</button>
            </div>
            <div className="live-content">
                {liveVideos.map((video) => (
                    <div key={video._id} className="live-video">
                        <video src={video.url} controls />
                        <div className="live-video-info">
                            <img src={video.author.avatar} alt={video.author.username} className="live-video-author-avatar" />
                            <div>
                                <h2>{video.author.username}</h2>
                                <p>{video.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Live;
