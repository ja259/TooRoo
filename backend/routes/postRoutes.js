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

// Routes for posts management

/**
 * @route POST /api/posts
 * @desc Create a new post
 * @access Private
 */
router.post('/', authenticate, upload.single('postImage'), createPost);

/**
 * @route GET /api/posts
 * @desc Get all posts
 * @access Private
 */
router.get('/', authenticate, getPosts);

/**
 * @route GET /api/posts/timeline-posts
 * @desc Get timeline posts
 * @access Private
 */
router.get('/timeline-posts', authenticate, getTimelinePosts);

/**
 * @route GET /api/posts/you-all-videos
 * @desc Get all videos for "You All" section
 * @access Private
 */
router.get('/you-all-videos', authenticate, getYouAllVideos);

/**
 * @route GET /api/posts/following-videos
 * @desc Get videos from users the current user is following
 * @access Private
 */
router.get('/following-videos', authenticate, getFollowingVideos);

/**
 * @route PUT /api/posts/:id/like
 * @desc Like or unlike a post
 * @access Private
 */
router.put('/:id/like', authenticate, likePost);

/**
 * @route POST /api/posts/:id/comment
 * @desc Comment on a post
 * @access Private
 */
router.post('/:id/comment', authenticate, commentOnPost);

/**
 * @route DELETE /api/posts/:id
 * @desc Delete a post
 * @access Private
 */
router.delete('/:id', authenticate, deletePost);

module.exports = router;

