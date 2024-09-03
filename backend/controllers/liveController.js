import LiveVideo from '../models/LiveVideo.js';
import User from '../models/User.js';

export const startLiveStream = async (req, res) => {
    const { title, url } = req.body;
    const userId = req.user._id;

    try {
        const liveVideo = new LiveVideo({
            title,
            url,
            author: userId,
            viewers: []
        });
        await liveVideo.save();
        res.status(201).json({ message: 'Live stream started', liveVideo });
    } catch (error) {
        console.error('Error starting live stream:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getLiveVideos = async (req, res) => {
    try {
        const liveVideos = await LiveVideo.find({ isLive: true })
            .populate('author', 'username profilePicture');
        res.json({ videos: liveVideos }); // Always return an array
    } catch (error) {
        console.error('Error fetching live videos:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const endLiveStream = async (req, res) => {
    const { id } = req.params;
    try {
        const liveVideo = await LiveVideo.findById(id);
        if (!liveVideo) {
            return res.status(404).json({ message: 'Live video not found' });
        }

        liveVideo.isLive = false;
        liveVideo.endedAt = Date.now();
        await liveVideo.save();

        res.json({ message: 'Live stream ended', liveVideo });
    } catch (error) {
        console.error('Error ending live stream:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
