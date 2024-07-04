const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;
const bucketName = process.env.GRIDFS_BUCKET || 'uploads';

if (!mongoURI) {
    throw new Error('MONGODB_URI environment variable is not defined');
}

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
                bucketName: bucketName
            };
            resolve(fileInfo);
        });
    })
});

module.exports = storage;
