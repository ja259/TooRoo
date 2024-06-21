const express = require('express');
const { uploadVideo, getVideos, deleteVideo, updateVideo } = require('../controllers/mediaController'); // Ensure all relevant controllers are imported
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const { authenticate } = require('../middlewares/authMiddleware'); // Ensure authentication middleware is imported

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
                bucketName: 'videos' // Specify the bucket name for storing videos
            };
            resolve(fileInfo);
        });
    })
});

const upload = multer({ storage });

// Route for uploading a video
router.post('/upload', authenticate, upload.single('video'), uploadVideo);

// Route for getting all videos
router.get('/', authenticate, getVideos);

// Route for deleting a video
router.delete('/:id', authenticate, deleteVideo);

// Route for updating a video description
router.put('/:id', authenticate, updateVideo);

module.exports = router;
