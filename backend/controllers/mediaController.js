const Video = require('../models/Video');
const mongoose = require('mongoose');

exports.uploadVideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file provided' });
    }
    const { description, authorId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
        return res.status(400).json({ message: 'Invalid author ID' });
    }
    const newVideo = new Video({
        videoUrl: req.file.filename, // Filename stored by GridFS
        description,
        author: authorId
    });
    await newVideo.save();
    res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
};

exports.getVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate('author', 'username email');
        if (!videos.length) {
            return res.status(404).json({ message: 'No videos found' });
        }
        res.json({ message: 'Videos retrieved successfully', videos });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.deleteVideo = async (req, res) => {
    const { videoId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json({ message: 'Invalid video ID' });
    }
    try {
        const video = await Video.findByIdAndRemove(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting video', error: error.message });
    }
};

exports.updateVideo = async (req, res) => {
    const { videoId } = req.params;
    const { description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).json({ message: 'Invalid video ID' });
    }
    try {
        const video = await Video.findByIdAndUpdate(videoId, { description }, { new: true });
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json({ message: 'Video updated successfully', video });
    } catch (error) {
        res.status(500).json({ message: 'Error updating video', error: error.message });
    }
};
