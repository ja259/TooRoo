import analyzePreferences from './analyzePreferences.js';
import Post from './models/Post.js';

const recommendContent = async (userId) => {
    try {
        const preferences = await analyzePreferences(userId);
        const likedPosts = preferences.likes.map(post => post._id);
        const commentedPosts = preferences.comments.map(post => post._id);

        const recommendedPosts = await Post.find({
            _id: { $nin: [...likedPosts, ...commentedPosts] }
        }).populate('author', 'username email').sort({ createdAt: -1 }).limit(10);

        return recommendedPosts;
    } catch (error) {
        console.error('Error recommending content:', error);
        throw new Error('Failed to recommend content');
    }
};

export default recommendContent;

