import React from 'react';

const CreateVideo = () => {
    const handleOpenCamera = () => {
        // Logic to open camera or upload video
        alert('Open camera to record video or take picture.');
    };

    return (
        <div>
            <h2>Create Video</h2>
            <button onClick={handleOpenCamera}>Open Camera</button>
        </div>
    );
};

export default CreateVideo;
