const analyzePreferences = require('./analyzePreferences');
const Post = require('../models/Post');

const recommendContent = async (userId) => {
    try {
        // Analyze user preferences based on their interactions
        const preferences = await analyzePreferences(userId);

        // Extract post IDs that the user has liked or commented on
        const likedPosts = preferences.likes.map(post => post._id);
        const commentedPosts = preferences.comments.map(post => post._id);

        // Find posts that the user has not interacted with, sorted by creation date
        const recommendedPosts = await Post.find({
            _id: { $nin: [...likedPosts, ...commentedPosts] }
        }).populate('author', 'username email').sort({ createdAt: -1 }).limit(10);

        return recommendedPosts;
    } catch (error) {
        console.error('Error recommending content:', error);
        throw new Error('Failed to recommend content');
    }
};

module.exports = recommendContent;
