const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).populate('posts');
        if (!user) return res.status(404).json({ message: 'User not found!' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { username, bio, avatar } = req.body;
    try {
        const user = await User.findByIdAndUpdate(id, { username, bio, avatar }, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
