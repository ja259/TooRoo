import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';  // Use the upload middleware
import { uploadVideo, getAllVideos, deleteVideo, updateVideo } from '../controllers/mediaController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/upload', protect, upload.single('video'), uploadVideo);
router.get('/videos', getAllVideos);
router.delete('/videos/:id', protect, deleteVideo);
router.put('/videos/:id', protect, updateVideo);

export default router;
