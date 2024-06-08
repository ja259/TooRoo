require('dotenv').config(); // Configuring environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

// GridFS Storage configuration
const gridFsStorage = require('./config/gridFsStorageConfig');

// Utility modules
const { emailService } = require('./utils/emailService');

// Middleware
const { errorHandler } = require('./middlewares/errorHandler');
const { authenticate } = require('./middlewares/authMiddleware');
const validate = require('./middlewares/validate');

// Route handlers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

// Business logic modules
const analyzePreferences = require('./analyzePreferences');
const recommendContent = require('./recommendContent');

// Models
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

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Multer setup for file uploads
const upload = multer({ storage: gridFsStorage });

// Routes
// Public routes that do not require authentication
app.use('/api/auth', authRoutes);

// Protected routes that require authentication
app.use('/api/users', authenticate, userRoutes);
app.use('/api/posts', authenticate, postRoutes);
app.use('/api/media', authenticate, mediaRoutes);

// Example file upload route, include authentication if necessary
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
