const Video = require('../models/Video');
const mongoose = require('mongoose');

exports.uploadVideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file provided' });
    }

    const { description, authorId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
        return res.status(400).send({ message: 'Invalid author ID' });
    }

    const newVideo = new Video({ videoUrl: req.file.filename, description, author: authorId });
    await newVideo.save();
    res.status(201).send({ message: 'Video uploaded successfully', video: newVideo });
};

exports.getVideos = async (req, res) => {
    const videos = await Video.find().populate('author', 'username email -_id');
    if (!videos.length) {
        return res.status(404).send({ message: 'No videos found' });
    }

    res.status(200).send({ message: 'Videos retrieved successfully', videos });
};

exports.deleteVideo = async (req, res) => {
    const { videoId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).send({ message: 'Invalid video ID' });
    }

    const video = await Video.findById(videoId);
    if (!video) {
        return res.status(404).send({ message: 'Video not found' });
    }

    await video.remove();
    res.status(200).send({ message: 'Video deleted successfully' });
};

exports.updateVideo = async (req, res) => {
    const { videoId } = req.params;
    const { description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        return res.status(400).send({ message: 'Invalid video ID' });
    }

    const video = await Video.findByIdAndUpdate(videoId, { description }, { new: true });
    if (!video) {
        return res.status(404).send({ message: 'Video not found' });
    }

    res.status(200).send({ message: 'Video updated successfully', video });
};
