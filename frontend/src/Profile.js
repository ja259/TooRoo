import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = ({ user }) => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5000/user/${user._id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }).then(response => {
                setProfile(response.data);
            }).catch(error => {
                console.error(error);
            });
        }
    }, [user]);

    return profile ? (
        <div className="profile">
            <img src={profile.avatar || '/default-avatar.png'} alt="Profile" className="profile-avatar" />
            <h2>{profile.username}</h2>
            <p>{profile.bio || "No bio"}</p>
            <div className="profile-stats">
                <span>{profile.following.length} Following</span>
                <span>{profile.followers.length} Followers</span>
                <span>{profile.posts.length} Posts</span>
            </div>
            <div className="profile-actions">
                <button>Edit Profile</button>
                <button>Share Profile</button>
            </div>
        </div>
    ) : (
        <p>Loading...</p>
    );
};

export default Profile;
