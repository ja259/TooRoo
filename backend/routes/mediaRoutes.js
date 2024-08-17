import express from 'express';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';  // Use the upload middleware
import { uploadVideo, getAllVideos, deleteVideo, updateVideo } from '../controllers/mediaController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/upload', protect, uploadMiddleware, uploadVideo);  // No need for .single('video')
router.get('/videos', getAllVideos);
router.delete('/videos/:id', protect, deleteVideo);
router.put('/videos/:id', protect, updateVideo);

export default router;
