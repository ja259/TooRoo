import React, { useEffect } from 'react';
import './ARFilters.css';
import * as faceapi from 'face-api.js';

const ARFilters = () => {
    useEffect(() => {
        const loadModels = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');
            startVideo();
        };

        const startVideo = () => {
            const video = document.getElementById('video');
            navigator.mediaDevices
                .getUserMedia({ video: {} })
                .then((stream) => {
                    video.srcObject = stream;
                })
                .catch((err) => console.error('Error accessing webcam: ', err));
        };

        const handleVideoPlay = () => {
            const video = document.getElementById('video');
            const canvas = faceapi.createCanvasFromMedia(video);
            document.getElementById('video-container').append(canvas);

            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);

            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                faceapi.draw.drawDetections(canvas, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
            }, 100);
        };

        loadModels();

        document.getElementById('video').addEventListener('play', handleVideoPlay);
    }, []);

    return (
        <div className="ar-filters">
            <h2>AR Filters and Effects</h2>
            <div id="video-container" className="video-container">
                <video id="video" autoPlay muted />
                <canvas id="canvas"></canvas>
            </div>
            <div className="filter-controls">
                <button className="filter-button">Filter 1</button>
                <button className="filter-button">Filter 2</button>
                <button className="filter-button">Filter 3</button>
            </div>
        </div>
    );
};

export default ARFilters;
