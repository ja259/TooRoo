import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';
import config from './config.js';

const mongoURI = config.dbUri;
const bucketName = process.env.GRIDFS_BUCKET || 'uploads';

if (!mongoURI) {
    throw new Error('MONGODB_URI environment variable is not defined');
}

const storage = new GridFsStorage({
    url: mongoURI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
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
        });
    }
});

export default storage;
