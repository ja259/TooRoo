const User = require('./models/User');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('posts');
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { username, bio, avatar } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, { username, bio, avatar }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.followUser = async (req, res) => {
    // Implementation of followUser
};

exports.unfollowUser = async (req, res) => {
    // Implementation of unfollowUser
};
