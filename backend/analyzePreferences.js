import Interaction from './models/Interaction.js';
import Post from './models/Post.js';
import mongoose from 'mongoose';

const analyzePreferences = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid ObjectId');
    }

    try {
        const interactions = await Interaction.find({ userId });
        const postIds = interactions.map(interaction => interaction.postId);
        const posts = await Post.find({ _id: { $in: postIds } }).populate('author', 'username email').exec();

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

