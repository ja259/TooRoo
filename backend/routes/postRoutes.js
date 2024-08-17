import express from 'express';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';  // Use the upload middleware
import { createPost, getPosts, getTimelinePosts, getYouAllVideos, getFollowingVideos, likePost, commentOnPost, deletePost } from '../controllers/postController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protect, uploadMiddleware, createPost);  // No need for .single('video')
router.get('/', getPosts);
router.get('/timeline-posts', protect, getTimelinePosts);
router.get('/you-all-videos', getYouAllVideos);
router.get('/following-videos', protect, getFollowingVideos);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentOnPost);
router.delete('/:id', protect, deletePost);

export default router;
