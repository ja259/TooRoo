import React, { useRef, useState } from 'react';

const CreateVideo = () => {
    const fileInputRef = useRef(null);
    const [video, setVideo] = useState(null);
    const [sound, setSound] = useState(null);

    const handleOpenCamera = () => {
        alert('Open camera to record video or take picture.');
    };

    const handleUploadFromGallery = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            alert(`Selected file - ${file.name}`);
            setVideo(file);
        }
    };

    const handleAddSoundOrMusic = () => {
        const soundFile = prompt('Enter the URL or path to the sound/music file:');
        if (soundFile) {
            alert('Sound/Music added to the video/photo.');
            setSound(soundFile);
        }
    };

    const handleSave = () => {
        if (video && sound) {
            alert('Video with sound/music saved successfully.');
            // Implement the logic to save/upload the video with sound/music
        } else {
            alert('Please select a video/photo and add sound/music.');
        }
    };

    return (
        <div className="create-video">
            <h2>Create Video or Photo</h2>
            <button onClick={handleOpenCamera}>Open Camera</button>
            <button onClick={handleUploadFromGallery}>Upload from Gallery</button>
            <input
                type="file"
                accept="image/*,video/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <button onClick={handleAddSoundOrMusic}>Add Sound/Music</button>
            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default CreateVideo;
