import express from 'express';
import multer from 'multer';
import { createPost, getPosts, getTimelinePosts, getYouAllVideos, getFollowingVideos, likePost, commentOnPost, deletePost } from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';
import storage from '../config/gridFsStorageConfig.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/', protect, upload.single('video'), createPost);
router.get('/', getPosts);
router.get('/timeline-posts', protect, getTimelinePosts);
router.get('/you-all-videos', getYouAllVideos);
router.get('/following-videos', protect, getFollowingVideos);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentOnPost);
router.delete('/:id', protect, deletePost);

export default router;
