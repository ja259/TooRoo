const express = require('express');
const { 
    createPost, 
    getPosts, 
    likePost, 
    commentOnPost, 
    deletePost, 
    getTimelinePosts,
    getYouAllVideos,
    getFollowingVideos
} = require('../controllers/postController');
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');

// Configure multer for image file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/'),
    filename: (req, file, cb) => {
        const date = new Date().toISOString().replace(/:/g, '-');
        cb(null, `${date}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

router.get('/timeline-posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username profilePicture').sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching timeline posts:', error);
        res.status(500).json({ message: 'Failed to retrieve posts', error: error.message });
    }
});

router.get('/you-all-videos', async (req, res) => {
    try {
        const videos = await Post.find({ videoUrl: { $exists: true } })
                                 .populate('author', 'username avatar')
                                 .sort({ createdAt: -1 })
                                 .limit(20);
        res.json(videos);
    } catch (error) {
        console.error('Error fetching videos for You All section:', error);
        res.status(500).json({ message: 'Failed to retrieve videos', error: error.message });
    }
});

router.get('/following-videos', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Assuming `req.user.id` comes from the authentication middleware
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const videos = await Post.find({ 
            author: { $in: user.following }, 
            videoUrl: { $exists: true } 
        })
        .populate('author', 'username avatar')
        .sort({ createdAt: -1 })
        .limit(20);

        res.json(videos);
    } catch (error) {
        console.error('Error fetching following videos:', error);
        res.status(500).json({ message: 'Failed to retrieve following videos', error: error.message });
    }
});


const router = express.Router();

// Routes for posts management
router.post('/', authenticate, upload.single('postImage'), createPost);
router.get('/', authenticate, getPosts);
router.get('/timeline-posts', authenticate, getTimelinePosts);
router.get('/you-all-videos', authenticate, getYouAllVideos);
router.get('/following-videos', authenticate, getFollowingVideos);
router.put('/:id/like', authenticate, likePost);
router.post('/:id/comment', authenticate, commentOnPost);
router.delete('/:id', authenticate, deletePost);

module.exports = router;
