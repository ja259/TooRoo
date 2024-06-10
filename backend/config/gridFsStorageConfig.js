const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

// Ensure environment variables are loaded
require('dotenv').config();

// MongoDB URI from environment
const mongoURI = process.env.MONGODB_URI;

// Create GridFsStorage instance
const storage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads'  // Specifies the GridFS bucket name for uploads
            };
            resolve(fileInfo);
        });
    })
});

module.exports = storage;
