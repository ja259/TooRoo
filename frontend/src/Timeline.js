import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Timeline.css';
import { FaHeart, FaComment, FaShare } from 'react-icons/fa';

const Timeline = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = user?.token;

            if (!token) {
                setError('User not authenticated');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/timeline-posts', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
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

    const handleLike = async (postId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.token;

        if (!token) {
            setError('User not authenticated');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/posts/${postId}/like`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId ? { ...post, likes: post.likes + 1 } : post
                )
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleComment = (postId) => {
        // Add functionality to handle commenting
    };

    const handleShare = (postId) => {
        // Add functionality to handle sharing
    };

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
                        <button className="icon-button" onClick={() => handleLike(post._id)}>
                            <FaHeart className="icon" title="Like" /> {post.likes}
                        </button>
                        <button className="icon-button" onClick={() => handleComment(post._id)}>
                            <FaComment className="icon" title="Comment" />
                        </button>
                        <button className="icon-button" onClick={() => handleShare(post._id)}>
                            <FaShare className="icon" title="Share" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Timeline;
