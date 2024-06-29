import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserAnalytics.css';

const UserAnalytics = () => {
    const [analytics, setAnalytics] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/analytics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAnalytics(response.data);
            } catch (err) {
                setError('Failed to fetch analytics');
            }
        };
        fetchAnalytics();
    }, []);

    return (
        <div className="analytics-container">
            <h1>User Analytics</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="analytics-content">
                <div className="analytics-item">
                    <h3>Posts</h3>
                    <p>{analytics.posts}</p>
                </div>
                <div className="analytics-item">
                    <h3>Followers</h3>
                    <p>{analytics.followers}</p>
                </div>
                <div className="analytics-item">
                    <h3>Likes</h3>
                    <p>{analytics.likes}</p>
                </div>
                <div className="analytics-item">
                    <h3>Comments</h3>
                    <p>{analytics.comments}</p>
                </div>
            </div>
        </div>
    );
};

export default UserAnalytics;
