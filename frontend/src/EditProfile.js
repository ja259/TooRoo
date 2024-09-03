import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';

const EditProfile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = response.data.user;
                setUser(userData);
                setUsername(userData.username);
                setBio(userData.bio);
                setProfilePicture(userData.profilePicture);
                setSocialLinks(userData.socialLinks || {});
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser();
    }, [userId]);

    const handleImageChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('bio', bio);
        formData.append('facebook', socialLinks.facebook);
        formData.append('twitter', socialLinks.twitter);
        formData.append('instagram', socialLinks.instagram);
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.put(`http://localhost:5000/api/users/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                // Update local storage with new profile picture URL
                const updatedUser = { ...JSON.parse(localStorage.getItem('user')), profilePicture: response.data.user.profilePicture };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(response.data.user); // Update user state with new data
            } else {
                console.error('Error updating profile:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="edit-profile">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Bio"
                />
                <input type="file" onChange={handleImageChange} accept="image/*" />
                <input
                    type="text"
                    value={socialLinks.facebook}
                    onChange={(e) =>
                        setSocialLinks({ ...socialLinks, facebook: e.target.value })
                    }
                    placeholder="Facebook"
                />
                <input
                    type="text"
                    value={socialLinks.twitter}
                    onChange={(e) =>
                        setSocialLinks({ ...socialLinks, twitter: e.target.value })
                    }
                    placeholder="Twitter"
                />
                <input
                    type="text"
                    value={socialLinks.instagram}
                    onChange={(e) =>
                        setSocialLinks({ ...socialLinks, instagram: e.target.value })
                    }
                    placeholder="Instagram"
                />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditProfile;
