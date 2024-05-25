import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/user/${id}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [id]);

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h2>{user.username}</h2>
            <p>{user.bio}</p>
            <img src={user.avatar} alt={`${user.username}'s avatar`} />
            <div>
                <h3>Posts</h3>
                {user.posts.map(post => (
                    <div key={post._id}>
                        <p>{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
