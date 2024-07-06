import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
    try {
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
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, bio, avatar },
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
        res.json({ message: 'Followed user successfully.' });
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
        const targetUser = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);
        if (!targetUser || !currentUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
        await currentUser.save();
        await targetUser.save();
        res.json({ message: 'Unfollowed user successfully.' });
    } catch (error) {
        console.error('Failed to unfollow user:', error);
        res.status(500).json({ message: 'Failed to unfollow user.', error: error.message });
    }
};
