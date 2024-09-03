import Interaction from './models/Interaction.js';
import Post from './models/Post.js';
import Video from './models/Video.js';
import LiveVideo from './models/LiveVideo.js';
import mongoose from 'mongoose';

const analyzePreferences = async (userId) => {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('User ID is required and must be valid');
    }

    try {
        // Fetch interactions for the user
        const interactions = await Interaction.find({ userId })
            .populate('postId videoId liveVideoId')
            .populate({
                path: 'postId',
                populate: { path: 'author', select: 'username profilePicture' }
            })
            .populate({
                path: 'videoId',
                populate: { path: 'author', select: 'username profilePicture' }
            })
            .populate({
                path: 'liveVideoId',
                populate: { path: 'author', select: 'username profilePicture' }
            });

        const preferences = {
            likedPosts: [],
            commentedPosts: [],
            likedVideos: [],
            viewedLiveVideos: [],
            watchTimes: {} // New: tracks watch time for videos and live streams
        };

        // Group interactions based on type
        interactions.forEach(interaction => {
            switch (interaction.interactionType) {
                case 'like':
                    if (interaction.postId) preferences.likedPosts.push(interaction.postId);
                    if (interaction.videoId) preferences.likedVideos.push(interaction.videoId);
                    break;
                case 'comment':
                    if (interaction.postId) preferences.commentedPosts.push(interaction.postId);
                    break;
                case 'view':
                    if (interaction.liveVideoId) preferences.viewedLiveVideos.push(interaction.liveVideoId);
                    break;
                case 'watch':
                    if (interaction.videoId) {
                        preferences.watchTimes[interaction.videoId._id] = interaction.watchTime;
                    }
                    break;
            }
        });

        return preferences;
    } catch (error) {
        console.error('Error analyzing preferences:', error);
        throw new Error('Failed to analyze preferences');
    }
};

export default analyzePreferences;
