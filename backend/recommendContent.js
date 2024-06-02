const Post = require('./models/Post');
const User = require('./models/User');
const analyzePreferences = require('./analyzePreferences');

async function recommendContent(userId) {
    try {
        const user = await User.findById(userId).populate('following');
        const followingIds = user.following.map(f => f._id);
        const recommendedPosts = await Post.find({ author: { $in: followingIds } });

        const sortedPostIds = await analyzePreferences(userId);
        const sortedPosts = sortedPostIds.map(postId => recommendedPosts.find(post => post._id.toString() === postId));

        return sortedPosts;
    } catch (error) {
        throw new Error('Error recommending content');
    }
}

module.exports = recommendContent;
