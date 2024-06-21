const Interaction = require('../models/Interaction');
const Post = require('../models/Post');

const analyzePreferences = async (userId) => {
    try {
        // Find all interactions for the user
        const interactions = await Interaction.find({ userId });

        // Extract post IDs from the interactions
        const postIds = interactions.map(interaction => interaction.postId);

        // Find all posts that match the post IDs and populate author details
        const posts = await Post.find({ _id: { $in: postIds } }).populate('author', 'username email');

        // Analyze user preferences based on likes and comments
        const preferences = {
            likes: posts.filter(post => post.likes.includes(userId)),
            comments: posts.filter(post => post.comments.some(comment => comment.author.toString() === userId))
        };

        return preferences;
    } catch (error) {
        console.error('Error analyzing preferences:', error);
        throw new Error('Failed to analyze preferences');
    }
};

module.exports = analyzePreferences;

