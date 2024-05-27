import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5000/user/${id}`)
            .then(response => {
                setUser(response.data);
                setUsername(response.data.username);
                setBio(response.data.bio);
                setAvatar(response.data.avatar);
            })
            .catch(error => {
                console.error(error);
            });
    }, [id]);

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            await axios.put(`http://localhost:5000/user/${id}`, { username, bio, avatar });
            setMessage('Profile updated successfully');
        } catch (error) {
            console.error(error);
            setMessage('An error occurred. Please try again.');
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', event.target.files[0]);
        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setVideoUrl(response.data.fileUrl); // eslint-disable-line no-unused-vars
            setMessage('Video uploaded successfully');
        } catch (error) {
            console.error(error);
            setMessage('An error occurred. Please try again.');
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h2>{user.username}</h2>
            <p>{user.bio}</p>
            <img src={user.avatar} alt={`${user.username}'s avatar`} />
            {user.videoUrl && <video src={user.videoUrl} controls />}
            <div>
                <h3>Followers: {user.followers.length}</h3>
                <h3>Following: {user.following.length}</h3>
            </div>
            <div>
                <h3>Update Profile</h3>
                <form onSubmit={handleUpdate}>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio"></textarea>
                    <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="Avatar URL" />
                    <button type="submit">Update</button>
                </form>
                <form>
                    <input type="file" onChange={handleUpload} />
                </form>
                {message && <p>{message}</p>}
            </div>
            <div>
                <h3>Posts</h3>
                {user.posts.map(post => (
                    <div key={post._id}>
                        <p>{post.content}</p>
                        {post.videoUrl && <video src={post.videoUrl} controls />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
