import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddProfilePicture.css';

const AddProfilePicture = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!image) {
            setError('Please select an image or skip this step.');
            return;
        }

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('profilePicture', image);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.token) {
                throw new Error('User authentication failed. Please log in again.');
            }

            const response = await axios.post('http://localhost:5000/api/users/upload-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            if (response.data.success) {
                // Update the user's profile picture in localStorage
                user.profilePicture = response.data.profilePictureUrl;
                localStorage.setItem('user', JSON.stringify(user));

                // Redirect to the two-factor authentication setup page
                navigate('/two-factor-auth');
            } else {
                setError('Failed to upload the image. Please try again.');
            }
        } catch (err) {
            if (err.message === 'User authentication failed. Please log in again.') {
                setError(err.message);
                localStorage.removeItem('user'); // Clear user data
                navigate('/login');
            } else if (err.response && err.response.status === 401) {
                setError('Unauthorized. Please log in again.');
                localStorage.removeItem('user'); // Clear user data
                navigate('/login');
            } else {
                setError('An error occurred while uploading the image. Please try again.');
            }
        } finally {
            setUploading(false);
        }
    };

    const handleSkip = () => {
        navigate('/two-factor-auth');
    };

    return (
        <div className="add-profile-picture">
            <h2>Add Profile Picture</h2>
            {error && <div className="error-message">{error}</div>}
            <input type="file" onChange={handleImageChange} accept="image/*" />
            <div className="buttons">
                <button onClick={handleSubmit} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Save'}
                </button>
                <button onClick={handleSkip} disabled={uploading}>
                    Skip
                </button>
            </div>
        </div>
    );
};

export default AddProfilePicture;
