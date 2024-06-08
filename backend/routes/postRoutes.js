const express = require('express');
const { createPost, getPosts, likePost, commentOnPost, deletePost } = require('../controllers/postController');
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');
const router = express.Router();

// Optional: Configure multer if posts include images or videos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB max file size
    },
    fileFilter: fileFilter
});

// Create a new post, with optional image upload
router.post('/', authenticate, upload.single('postImage'), createPost);

// Get all posts
router.get('/', authenticate, getPosts);

// Like a post
router.put('/:id/like', authenticate, likePost);

// Comment on a post
router.post('/:id/comment', authenticate, commentOnPost);

// Delete a post
router.delete('/:id', authenticate, deletePost);

module.exports = router;
