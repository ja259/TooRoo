const Post = require('./models/Post');
const analyzePreferences = require('./analyzePreferences');

const recommendContent = async (userId) => {
    const preferences = await analyzePreferences(userId);
    const recommendedPosts = [];

    const sortedPostIds = Object.keys(preferences).sort((a, b) => {
        const scoreA = preferences[a].likes * 2 + preferences[a].comments * 3 + preferences[a].shares * 5 + preferences[a].views;
        const scoreB = preferences[b].likes * 2 + preferences[b].comments * 3 + preferences[b].shares * 5 + preferences[b].views;
        return scoreB - scoreA;
    });

    for (const postId of sortedPostIds) {
        const post = await Post.findById(postId);
        recommendedPosts.push(post);
    }

    return recommendedPosts;
};

module.exports = recommendContent;
