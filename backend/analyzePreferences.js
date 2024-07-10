import Interaction from './models/Interaction.js';
import Post from './models/Post.js';

const analyzePreferences = async (userId) => {
    try {
        const interactions = await Interaction.find({ userId });
        const postIds = interactions.map(interaction => interaction.postId);
        const posts = await Post.find({ _id: { $in: postIds } }).populate('author', 'username email');

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

export default analyzePreferences;



