const User = require('../models/User');

// Get user profile with posts
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('posts');
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json({ message: 'User profile retrieved successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { username, bio, avatar } = req.body;

    if (!username && !bio && !avatar) {
        return res.status(400).json({ message: 'No update information provided' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { username, bio, avatar }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Follow a user
exports.followUser = async (req, res) => {
    const userId = req.params.id; // User to follow
    const currentUserId = req.body.userId; // Current logged in user

    if (!currentUserId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const targetUser = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Avoid duplicate follows
        if (!currentUser.following.includes(userId)) {
            currentUser.following.push(userId);
            targetUser.followers.push(currentUserId);
            await currentUser.save();
            await targetUser.save();
        }

        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
    const userId = req.params.id; // User to unfollow
    const currentUserId = req.body.userId; // Current logged in user

    if (!currentUserId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const targetUser = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove from following and followers lists
        currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
