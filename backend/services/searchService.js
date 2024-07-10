import Post from '../models/Post.js';
import User from '../models/User.js';

export const search = async (query) => {
    try {
        const users = await User.find({ username: new RegExp(query, 'i') });
        const posts = await Post.find({ content: new RegExp(query, 'i') });

        return { users, posts };
    } catch (error) {
        throw new Error('Search failed');
    }
};
