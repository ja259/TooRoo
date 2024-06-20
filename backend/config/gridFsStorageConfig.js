const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const config = require('./config'); // Import configuration

// Create GridFsStorage instance
const storage = new GridFsStorage({
  url: config.dbUri,
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

