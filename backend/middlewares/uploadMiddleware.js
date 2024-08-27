import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Set up storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Save uploads in the 'uploads/' directory
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, buf) => {
            if (err) return cb(err);
            cb(null, buf.toString('hex') + path.extname(file.originalname));  // Generate a unique filename
        });
    }
});

// File filter to allow only specific file types
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi/;  // Allowed file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images and videos are allowed'));
    }
};

// Set up multer with the storage configuration and file filter
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 50 },  // 50 MB limit
    fileFilter: fileFilter
});

// Export the middleware function
const uploadMiddleware = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `Multer error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
        }
        next();
    });
};

export default uploadMiddleware;
