import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Timeline.css';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';

const Timeline = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/timeline-posts');
                setPosts(response.data);
            } catch (error) {
                setError('Error fetching posts');
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="timeline">
            {posts.map((post) => (
                <div key={post._id} className="post">
                    <div className="post-header">
                        <img src={post.author.profilePicture} alt={post.author.username} className="post-author-img" />
                        <span className="post-author">{post.author.username}</span>
                    </div>
                    <div className="post-content">
                        <p>{post.content}</p>
                        {post.imageUrl && <img src={post.imageUrl} alt="Post content" className="post-image" />}
                        {post.videoUrl && <video src={post.videoUrl} controls className="post-video"></video>}
                    </div>
                    <div className="post-footer">
                        <button className="icon-button"><FaHeart className="icon" title="Like" /></button>
                        <button className="icon-button"><FaComment className="icon" title="Comment" /></button>
                        <button className="icon-button"><FaShare className="icon" title="Share" /></button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
