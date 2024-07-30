import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaShare, FaThumbsUp, FaComment, FaHome, FaInbox, FaBell, FaUser, FaVideo } from 'react-icons/fa';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('text');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (err) {
                setError('Failed to fetch user');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleFollow = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            await axios.post(`http://localhost:5000/api/users/${id}/follow`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser((prevUser) => ({
                ...prevUser,
                isFollowing: !prevUser.isFollowing,
                followers: prevUser.isFollowing ? prevUser.followers - 1 : prevUser.followers + 1
            }));
        } catch (err) {
            setError('Failed to follow/unfollow user');
        }
    };

    const handleMessage = () => {
        navigate(`/inbox?user=${user.username}`);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!user) return <div>No user found</div>;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <img src={user.avatar} alt="Profile" className="profile-avatar" />
                <div className="profile-info">
                    <h2>{user.username}</h2>
                    <button className="follow" onClick={handleFollow}>
                        {user.isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="message" onClick={handleMessage}><FaInbox /> Message</button>
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
                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}><FaHome /><span>Home</span></NavLink>
                <NavLink to="/inbox" className={({ isActive }) => isActive ? 'active' : ''}><FaInbox /><span>Inbox</span></NavLink>
                <NavLink to="/create-video" className={({ isActive }) => isActive ? 'active' : ''}><FaVideo /></NavLink>
                <NavLink to="/notifications" className={({ isActive }) => isActive ? 'active' : ''}><FaBell /><span>Notifications</span></NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}><FaUser /><span>Profile</span></NavLink>
            </div>
        </div>
    );
};

export default Profile;
