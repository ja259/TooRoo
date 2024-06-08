const express = require('express');
const { uploadVideo, getVideos } = require('../controllers/mediaController');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const router = express.Router();

// Configure GridFS storage for video uploads
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
                bucketName: 'videos' // Specifies the GridFS bucket name
            };
            resolve(fileInfo);
        });
    })
});

const upload = multer({ storage });

// Route to handle video uploads
router.post('/upload', upload.single('video'), uploadVideo);

// Route to retrieve all videos
router.get('/', getVideos);

module.exports = router;
