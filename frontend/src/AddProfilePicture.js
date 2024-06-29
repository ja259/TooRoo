import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProfilePicture.css';

const AddProfilePicture = () => {
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = () => {
        // Logic to upload profile picture or skip
        navigate('/dashboard'); // Redirect to the dashboard
    };

    return (
        <div className="add-profile-picture">
            <h2>Add Profile Picture</h2>
            <input type="file" onChange={handleImageChange} />
            <button onClick={handleSubmit}>Save</button>
            <button onClick={() => navigate('/dashboard')}>Skip</button>
        </div>
    );
};

export default AddProfilePicture;
