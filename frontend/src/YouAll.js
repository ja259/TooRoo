// src/YouAll.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './YouAll.css';

const YouAll = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/you-all-videos');
                setVideos(response.data);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchVideos();
    }, []);

    return (
        <div className="you-all">
            {videos.map(video => (
                <div key={video._id} className="video-container">
                    <video controls src={video.videoUrl} className="video-content"></video>
                    <div className="video-details">
                        <img src={video.author.avatar} alt="avatar" className="avatar" />
                        <div className="video-info">
                            <h4>{video.author.username}</h4>
                            <p>{video.description}</p>
                        </div>
                        <div className="video-stats">
                            <span>{video.likes} ❤️</span>
                            <span>{video.comments} 💬</span>
                            <span>{video.shares} ↪️</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default YouAll;
