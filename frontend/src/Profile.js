import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaShare, FaThumbsUp, FaComment, FaHome, FaInbox, FaBell, FaUser, FaVideo } from 'react-icons/fa';
import './Profile.css';
import { NavLink } from 'react-router-dom';

const Profile = ({ userId, isCurrentUser }) => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('text');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user', error);
            }
        };
        fetchUser();
    }, [userId]);

    const handleFollow = async () => {
        // Logic for following/unfollowing a user
    };

    const renderContent = () => {
        if (activeTab === 'text') {
            return (
                <div className="text-content">
                    {user.posts.map(post => (
                        <div className="post" key={post._id}>
                            <div className="post-header">
                                <img src={user.avatar} alt="Avatar" className="avatar" />
                                <div>
                                    <span className="username">{user.username}</span>
                                    <span className="timestamp">{new Date(post.createdAt).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="post-content">
                                <p>{post.content}</p>
                                {post.image && <img src={post.image} alt="Post" />}
                            </div>
                            <div className="post-actions">
                                <button><FaThumbsUp /> Like</button>
                                <button><FaComment /> Comment</button>
                                <button><FaShare /> Share</button>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else if (activeTab === 'video') {
            return (
                <div className="video-content">
                    {user.videos.map(video => (
                        <div className="video" key={video._id}>
                            <video src={video.videoUrl} controls></video>
                            <span>{video.views} views</span>
                        </div>
                    ))}
                </div>
            );
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <img src={user.avatar} alt="Profile" className="profile-avatar" />
                <div className="profile-info">
                    <h2>{user.username}</h2>
                    {isCurrentUser ? (
                        <button className="edit-profile"><FaEdit /> Edit Profile</button>
                    ) : (
                        <>
                            <button className="follow" onClick={handleFollow}>{user.isFollowing ? 'Following' : 'Follow'}</button>
                            <button className="message"><FaInbox /> Message</button>
                        </>
                    )}
                    <p>{user.bio}</p>
                </div>
                <div className="profile-stats">
                    <span>Following: {user.following.length}</span>
                    <span>Followers: {user.followers.length}</span>
                </div>
            </div>
            <div className="profile-tabs">
                <button className={activeTab === 'text' ? 'active' : ''} onClick={() => setActiveTab('text')}>
                    <FaEdit /> Text
                </button>
                <button className={activeTab === 'video' ? 'active' : ''} onClick={() => setActiveTab('video')}>
                    <FaVideo /> Video
                </button>
            </div>
            <div className="profile-content">
                {renderContent()}
            </div>
            <div className="bottom-nav">
                <NavLink to="/" activeClassName="active"><FaHome /><span>Home</span></NavLink>
                <NavLink to="/inbox" activeClassName="active"><FaInbox /><span>Inbox</span></NavLink>
                <NavLink to="/create-video" activeClassName="active"><FaVideo /></NavLink>
                <NavLink to="/notifications" activeClassName="active"><FaBell /><span>Notifications</span></NavLink>
                <NavLink to="/profile" activeClassName="active"><FaUser /><span>Profile</span></NavLink>
            </div>
        </div>
    );
};

export default Profile;
