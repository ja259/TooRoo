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
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            // Use crypto to generate unique filenames
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                // Construct filename using random bytes and file extension
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads' // Use 'uploads' bucket to store files
                };
                resolve(fileInfo);
            });
        });
    }
});

module.exports = storage;
