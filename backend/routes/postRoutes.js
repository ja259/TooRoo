const express = require('express');
const { createPost, getPosts, likePost, commentOnPost, deletePost } = require('../controllers/postController');
const { authenticate } = require('../middlewares/authMiddleware');
const multer = require('multer');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const date = new Date().toISOString().replace(/:/g, '-');
        cb(null, `${date}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 }, fileFilter });

// Routes setup with authentication and multer for file uploads
router.post('/', authenticate, upload.single('postImage'), createPost);
router.get('/', authenticate, getPosts);
router.put('/:id/like', authenticate, likePost);
router.post('/:id/comment', authenticate, commentOnPost);
router.delete('/:id', authenticate, deletePost);

module.exports = router;
