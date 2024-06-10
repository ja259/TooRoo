const analyzePreferences = require('./analyzePreferences');
const Post = require('./models/Post');

const recommendContent = async (userId) => {
    const preferences = await analyzePreferences(userId);
    const likedPosts = preferences.likes.map(post => post._id);
    const commentedPosts = preferences.comments.map(post => post._id);

    // Find posts that are not liked or commented on by the user
    const recommendedPosts = await Post.find({
        _id: { $nin: [...likedPosts, ...commentedPosts] }
    }).populate('author', 'username email') // Include author details
      .sort({ createdAt: -1 }) // Newest posts first
      .limit(10); // Limit to 10 posts

    return recommendedPosts;
};

module.exports = recommendContent;

