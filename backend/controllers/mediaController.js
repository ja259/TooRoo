const Video = require('../models/Video');
const mongoose = require('mongoose');

// Upload video and handle video file
exports.uploadVideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file provided' });
    }
    const { description, authorId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
        return res.status(400).json({ message: 'Invalid author ID' });
    }

    try {
        const newVideo = new Video({
            videoUrl: req.file.filename, // Filename stored by GridFS
            description,
            author: authorId
        });
        await newVideo.save();
        res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
    } catch (error) {
        res.status(500).json({ message: 'Error saving video to database', error: error.message });
    }
};

// Retrieve all videos with detailed information about the author
exports.getVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate('author', 'username email -_id');
        if (!videos.length) {
            return res.status(404).json({ message: 'No videos found' });
        }
        res.status(200).json({ message: 'Videos retrieved successfully', videos });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
