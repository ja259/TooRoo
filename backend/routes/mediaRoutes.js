import express from 'express';
import { uploadVideo, getAllVideos, deleteVideo, updateVideo } from '../controllers/mediaController.js';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: 'videos'
            };
            resolve(fileInfo);
        });
    })
});

const upload = multer({ storage });

router.post('/upload', authenticate, upload.single('video'), uploadVideo);
router.get('/you-all-videos', authenticate, getAllVideos);
router.delete('/:id', authenticate, deleteVideo);
router.put('/:id', authenticate, updateVideo);

export default router;
