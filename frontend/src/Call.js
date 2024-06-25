import React, { useState, useRef } from 'react';
import { FaPhoneAlt, FaVideo } from 'react-icons/fa';
import './Call.css';

const Call = () => {
    const [inCall, setInCall] = useState(false);
    const videoRef = useRef();

    const startCall = async (isVideo) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: isVideo, audio: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setInCall(true);
        } catch (error) {
            console.error('Error starting call:', error);
        }
    };

    const endCall = () => {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        setInCall(false);
    };

    return (
        <div className="call">
            {inCall ? (
                <>
                    <video ref={videoRef} className="call-video" />
                    <button onClick={endCall} className="end-call">End Call</button>
                </>
            ) : (
                <div className="call-buttons">
                    <button onClick={() => startCall(false)}><FaPhoneAlt /></button>
                    <button onClick={() => startCall(true)}><FaVideo /></button>
                </div>
            )}
        </div>
    );
};

export default Call;
