import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Timeline.css';

const Timeline = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/timeline-posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

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
                        {post.videoUrl && <video src={post.videoUrl} controls className="post-video"></video>}
                    </div>
                    <div className="post-footer">
                        <button className="like-button">Like</button>
                        <button className="comment-button">Comment</button>
                        <button className="share-button">Share</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
