const User = require('../models/User');
const Post = require('../models/Post');

const searchUsers = async (query) => {
    try {
        const users = await User.find({ username: new RegExp(query, 'i') });
        return users;
    } catch (error) {
        console.error('Error searching users:', error);
        throw new Error('Search error');
    }
};

const searchPosts = async (query) => {
    try {
        const posts = await Post.find({ content: new RegExp(query, 'i') })
            .populate('author', 'username avatar');
        return posts;
    } catch (error) {
        console.error('Error searching posts:', error);
        throw new Error('Search error');
    }
};

module.exports = {
    searchUsers,
    searchPosts
};
