const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

// Ensure environment variables are loaded
require('dotenv').config();

// MongoDB URI from environment
const mongoURI = process.env.MONGODB_URI;
const bucketName = process.env.GRIDFS_BUCKET || 'uploads';

// Validate the environment variables
if (!mongoURI) {
    throw new Error('MONGODB_URI environment variable is not defined');
}

// Create GridFsStorage instance
const storage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => new Promise((resolve, reject) => {
        // Generate a random 16-byte hex string for the filename
        crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
            const filename = buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
                filename: filename,
                bucketName: bucketName // Specifies the GridFS bucket name for uploads
            };
            resolve(fileInfo);
        });
    })
});

module.exports = storage;

