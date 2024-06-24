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

const router = express.Router();

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

router.post('/', authenticate, upload.single('postImage'), createPost);
router.get('/', authenticate, getPosts);
router.get('/timeline-posts', authenticate, getTimelinePosts);
router.get('/you-all-videos', authenticate, getYouAllVideos);
router.get('/following-videos', authenticate, getFollowingVideos);
router.put('/:id/like', authenticate, likePost);
router.post('/:id/comment', authenticate, commentOnPost);
router.delete('/:id', authenticate, deletePost);

module.exports = router;

