import React, { useState, useRef } from 'react';
import { FaPhoneSlash, FaVideoSlash } from 'react-icons/fa';
import './VideoCall.css';

const VideoCall = () => {
    const [inCall, setInCall] = useState(false);
    const videoRef = useRef();

    const startCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setInCall(true);
        } catch (error) {
            console.error('Error starting video call:', error);
        }
    };

    const endCall = () => {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        setInCall(false);
    };

    return (
        <div className="video-call">
            {inCall ? (
                <>
                    <video ref={videoRef} className="video" />
                    <button onClick={endCall} className="end-call"><FaVideoSlash /> End Call</button>
                </>
            ) : (
                <button onClick={startCall} className="start-call"><FaVideoSlash /> Start Video Call</button>
            )}
        </div>
    );
};

export default VideoCall;
