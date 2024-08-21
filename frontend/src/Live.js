import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Live.css';

const Live = ({ user }) => {
    const [liveVideos, setLiveVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLiveVideos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/live-videos'); // Ensure this matches your backend route
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (liveVideos.length === 0) {
        return <div className="no-videos">No live videos are currently available.</div>;
    }

    return (
        <div className="live">
            <div className="live-header">
                <h1><span role="img" aria-label="Live">🔴</span> Live Videos</h1>
                <button className="go-live-button">Go Live</button>
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
            <div className="live-sidebar">
                <h3>Viewers</h3>
                <ul className="live-viewers">
                    {/* List of viewers */}
                </ul>
                <h3>Comments</h3>
                <ul className="live-comments">
                    {/* List of comments */}
                </ul>
                <div className="comment-input">
                    <input type="text" placeholder="Add a comment" />
                    <button>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Live;
