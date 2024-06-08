const User = require('../models/User');

// Update user profile
exports.updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { username, bio, avatar } = req.body;

    if (!username && !bio && !avatar) {
        return res.status(400).json({ message: 'Update information cannot be empty.' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { username, bio, avatar },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({ message: 'User profile updated successfully.', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user profile.', error: error.message });
    }
};

// Follow a user
exports.followUser = async (req, res) => {
    const userId = req.params.id;
    const currentUserId = req.body.userId;

    if (!currentUserId) {
        return res.status(400).json({ message: 'User ID is required for following.' });
    }

    try {
        const targetUser = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (currentUser.following.includes(userId)) {
            return res.status(400).json({ message: 'You are already following this user.' });
        }

        currentUser.following.push(userId);
        targetUser.followers.push(currentUserId);
        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: 'Followed user successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to follow user.', error: error.message });
    }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
    const userId = req.params.id;
    const currentUserId = req.body.userId;

    if (!currentUserId) {
        return res.status(400).json({ message: 'User ID is required for unfollowing.' });
    }

    try {
        const targetUser = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({ message: 'Unfollowed user successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to unfollow user.', error: error.message });
    }
};
