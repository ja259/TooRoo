const Video = require('./models/Video');

exports.uploadVideo = async (req, res) => {
    const { videoUrl, description, authorId } = req.body;
    try {
        const newVideo = new Video({ videoUrl, description, author: authorId });
        await newVideo.save();
        res.status(201).json(newVideo);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getVideos = async (req, res) => {
    try {
        const videos = await Video.find().populate('author');
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
