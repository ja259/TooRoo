import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';

const EditProfile = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [pronouns, setPronouns] = useState('');
    const [website, setWebsite] = useState('');
    const [category, setCategory] = useState('');
    const [socialLinks, setSocialLinks] = useState({
        facebook: '',
        twitter: '',
        instagram: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
                setUser(response.data);
                setUsername(response.data.username);
                setName(response.data.name);
                setBio(response.data.bio);
                setPronouns(response.data.pronouns);
                setWebsite(response.data.website);
                setCategory(response.data.category);
                setSocialLinks(response.data.socialLinks);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/users/${userId}`, {
                username,
                name,
                bio,
                pronouns,
                website,
                category,
                socialLinks
            });
            // Handle success
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="edit-profile">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                <input type="text" value={pronouns} onChange={(e) => setPronouns(e.target.value)} placeholder="Pronouns" />
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" />
                <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website" />
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
                <input type="text" value={socialLinks.facebook} onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} placeholder="Facebook" />
                <input type="text" value={socialLinks.twitter} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })} placeholder="Twitter" />
                <input type="text" value={socialLinks.instagram} onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })} placeholder="Instagram" />
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default EditProfile;
