require('dotenv').config(); // Configuring environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

// Import custom modules for business logic
const analyzePreferences = require('./analyzePreferences');
const recommendContent = require('./recommendContent');

// Import models
const User = require('./models/User');
const Post = require('./models/Post');
const Interaction = require('./models/Interaction');
const Video = require('./models/Video');

const app = express();
const port = process.env.PORT || 5000;

// CORS options to allow requests from specific origins
const corsOptions = {
    origin: ['http://localhost:3000', 'https://ja259.github.io'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Configure multer with GridFS storage
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

// Routes (would be better if moved to a separate file and imported)
require('./routes/authRoutes')(app, { bcrypt, jwt, User, nodemailer, crypto });
require('./routes/userRoutes')(app, { User, Post });
require('./routes/postRoutes')(app, { Post, User, Interaction });
require('./routes/mediaRoutes')(app, { Video, User });

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Internal Server Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
