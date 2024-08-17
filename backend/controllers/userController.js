import User from '../models/User.js';
import Post from '../models/Post.js';
import mongoose from 'mongoose';

export const getUserProfile = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(req.params.id).populate('posts');
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.json({ message: 'User profile retrieved successfully', user });
    } catch (error) {
        console.error('Failed to retrieve user profile:', error);
        res.status(500).json({ message: 'Failed to retrieve user profile.', error: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    const { username, bio, avatar } = req.body;
    if (!username && !bio && !avatar) {
        return res.status(400).json({ message: 'Update information cannot be empty.' });
    }
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                username,
                bio,
                avatar: req.file ? `/uploads/${req.file.filename}` : avatar
            },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ message: 'User profile updated successfully.', user: updatedUser });
    } catch (error) {
        console.error('Failed to update user profile:', error);
        res.status(500).json({ message: 'Failed to update user profile.', error: error.message });
    }
};

export const followUser = async (req, res) => {
    const { id: userId } = req.params;
    const { userId: currentUserId } = req.body;

    if (!currentUserId) {
        return res.status(400).json({ message: 'User ID is required for following.' });
    }
    try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const targetUser = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (currentUser.following.includes(userId)) {
            return res.status(400).json({ message: 'You are already following this user.' });
        }

        currentUser.following.push(userId);
        await currentUser.save();
        res.json({ message: 'Followed user successfully.', user: currentUser });
    } catch (error) {
        console.error('Failed to follow user:', error);
        res.status(500).json({ message: 'Failed to follow user.', error: error.message });
    }
};

export const unfollowUser = async (req, res) => {
    const { id: userId } = req.params;
    const { userId: currentUserId } = req.body;

    if (!currentUserId) {
        return res.status(400).json({ message: 'User ID is required for unfollowing.' });
    }
    try {
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const targetUser = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!currentUser.following.includes(userId)) {
            return res.status(400).json({ message: 'You are not following this user.' });
        }

        currentUser.following = currentUser.following.filter(followedUserId => followedUserId.toString() !== userId);
        await currentUser.save();
        res.json({ message: 'Unfollowed user successfully.', user: currentUser });
    } catch (error) {
        console.error('Failed to unfollow user:', error);
        res.status(500).json({ message: 'Failed to unfollow user.', error: error.message });
    }
};

export const getUserAnalytics = async (req, res) => {
    const { userId } = req.user;
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);
        const posts = await Post.find({ author: userId });
        const likes = posts.reduce((acc, post) => acc + post.likes.length, 0);
        const comments = posts.reduce((acc, post) => acc + post.comments.length, 0);

        res.json({
            posts: posts.length,
            followers: user.followers.length,
            following: user.following.length,
            likes,
            comments
        });
    } catch (error) {
        console.error('Failed to retrieve user analytics:', error);
        res.status(500).json({ message: 'Failed to retrieve user analytics', error: error.message });
    }
};
