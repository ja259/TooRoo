import Post from '../models/Post.js';
import User from '../models/User.js';
import Video from '../models/Video.js';

// Function to search posts
export const searchPosts = async (query) => {
    try {
        const posts = await Post.find({ content: new RegExp(query, 'i') });
        return posts;
    } catch (error) {
        throw new Error('Search for posts failed');
    }
};

// Function to search users
export const searchUsers = async (query) => {
    try {
        const users = await User.find({ username: new RegExp(query, 'i') });
        return users;
    } catch (error) {
        throw new Error('Search for users failed');
    }
};

// Function to search videos
export const searchVideos = async (query) => {
    try {
        const videos = await Video.find({ description: new RegExp(query, 'i') });
        return videos;
    } catch (error) {
        throw new Error('Search for videos failed');
    }
};
