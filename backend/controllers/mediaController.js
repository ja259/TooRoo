import Video from '../models/Video.js';
import mongoose from 'mongoose';

export const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided' });
        }

        const { description, authorId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).json({ message: 'Invalid author ID' });
        }

        const newVideo = new Video({
            videoUrl: req.file.filename,
            description,
            author: authorId
        });

        await newVideo.save();

        return res.status(201).json({ message: 'Video uploaded successfully', video: newVideo });
    } catch (error) {
        console.error('Error uploading video:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getAllVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate('author', 'username email avatar');

        if (videos.length === 0) {
            return res.status(404).json({ message: 'No videos found' });
        }

        return res.json({ message: 'Videos retrieved successfully', videos });
    } catch (error) {
        console.error('Error retrieving videos:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid video ID' });
    }

    try {
        const video = await Video.findByIdAndRemove(id);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        return res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        return res.status(500).json({ message: 'Error deleting video', error: error.message });
    }
};

export const updateVideo = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid video ID' });
    }

    try {
        const video = await Video.findByIdAndUpdate(id, { description }, { new: true });

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        return res.json({ message: 'Video updated successfully', video });
    } catch (error) {
        console.error('Error updating video:', error);
        return res.status(500).json({ message: 'Error updating video', error: error.message });
    }
};
