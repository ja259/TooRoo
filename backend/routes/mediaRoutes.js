const express = require('express');
const { uploadVideo, getVideos, deleteVideo, updateVideo } = require('../controllers/mediaController');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const { authenticate } = require('../middlewares/authMiddleware');

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
router.get('/you-all-videos', authenticate, getVideos);
router.delete('/:id', authenticate, deleteVideo);
router.put('/:id', authenticate, updateVideo);

module.exports = router;
