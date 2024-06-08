const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const { uploadMedia, getMedia } = require('../controllers/mediaController');
const router = express.Router();

const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        return {
            bucketName: 'uploads', // Use 'uploads' for storing files
            filename: `${Date.now()}-tooRoo-${file.originalname}`
        };
    }
});

const upload = multer({ storage });

// Upload media
router.post('/upload', upload.single('file'), uploadMedia);

// Retrieve media
router.get('/:filename', getMedia);

module.exports = router;
