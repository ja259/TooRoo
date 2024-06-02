const Post = require('./models/Post');
const analyzePreferences = require('./analyzePreferences');

const recommendContent = async (userId) => {
    try {
        const preferences = await analyzePreferences(userId);

        const sortedPreferences = Object.keys(preferences).sort((a, b) => preferences[b] - preferences[a]);

        const recommendedPosts = await Post.find({
            _id: { $in: sortedPreferences }
        }).populate('author').lean();

        return recommendedPosts;
    } catch (error) {
        console.error('Error recommending content:', error);
        throw error;
    }
};

module.exports = recommendContent;
