require('dotenv').config(); // Configuring environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const gridFsStorage = require('./config/gridFsStorageConfig'); // Import the GridFS storage configuration correctly

// Import utility modules
const { errorHandler } = require('./utils/errorHandler');
const { emailService } = require('./utils/emailService');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

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
const upload = multer({ storage: gridFsStorage });

// Apply routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/media', mediaRoutes);

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
    res.send('File uploaded successfully');
});

// Global error handling middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
