import express from 'express';
import { startLiveStream, getLiveVideos, endLiveStream } from '../controllers/liveController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/live/start', protect, startLiveStream);
router.get('/live-videos', getLiveVideos);
router.put('/live/end/:id', protect, endLiveStream);

export default router;
