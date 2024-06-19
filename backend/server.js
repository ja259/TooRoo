require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// Import configurations and middlewares
const gridFsStorage = require('./config/gridFsStorageConfig');
const errorHandler = require('./middlewares/errorHandler');
const authenticate = require('./middlewares/authMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const timelineRoutes = require('./routes/timelineRoutes'); // Add timeline routes

const app = express();
const port = process.env.PORT || 5000;

// Middleware configurations
app.use(cors({ 
    origin: ['http://localhost:8080', 'https://ja259.github.io'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Multer configuration
const upload = multer({ storage: gridFsStorage });

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/timeline-posts', timelineRoutes); // Add timeline routes

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
    res.status(200).send({ message: 'File uploaded successfully', fileName: req.file.filename });
});

// Error handling middleware
app.use(errorHandler);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
