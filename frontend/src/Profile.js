import React from 'react';
import './Profile.css';

const Profile = ({ user }) => {
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile">
            <img src={user.profilePicture || 'default-profile.png'} alt="Profile" />
            <h2>{user.username}</h2>
            <p>{user.bio || 'No bio available'}</p>
            <div className="user-stats">
                <span>{user.following.length} Following</span>
                <span>{user.followers.length} Followers</span>
            </div>
            <button>Edit Profile</button>
            <button>Share Profile</button>
            <div className="tabs">
                <span className="tab active">Text</span>
                <span className="tab">Video</span>
            </div>
        </div>
    );
};

export default Profile;
