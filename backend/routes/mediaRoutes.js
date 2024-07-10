import express from 'express';
import multer from 'multer';
import { uploadVideo, getAllVideos, deleteVideo, updateVideo } from '../controllers/mediaController.js';
import { protect } from '../middlewares/authMiddleware.js';
import storage from '../config/gridFsStorageConfig.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/upload', protect, upload.single('video'), uploadVideo);
router.get('/videos', getAllVideos);
router.delete('/videos/:id', protect, deleteVideo);
router.put('/videos/:id', protect, updateVideo);

export default router;
