require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

// Import configuration for GridFS
const gridFsStorage = require('./config/gridFsStorageConfig');

// Utility modules
const { emailService } = require('./utils/emailService'); // Assuming emailService exports a function correctly

// Middleware
const errorHandler = require('./middlewares/errorHandler');
const authenticate = require('./middlewares/authMiddleware');
const { validateRegister, validateLogin, validateResetPassword } = require('./middlewares/validate');

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

app.use(cors({ origin: ['http://localhost:3000', 'https://ja259.github.io'], optionsSuccessStatus: 200 }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

const upload = multer({ storage: gridFsStorage });

// Correctly apply validation middleware before authRoutes handlers
app.use('/api/auth', validateRegister, authRoutes);
app.use('/api/auth', validateLogin, authRoutes);
app.use('/api/auth', validateResetPassword, authRoutes);

app.use('/api/users', authenticate, userRoutes);
app.use('/api/posts', authenticate, postRoutes);
app.use('/api/media', authenticate, mediaRoutes);

app.post('/upload', upload.single('file'), (req, res) => {
    res.send({ message: 'File uploaded successfully', fileName: req.file.filename });
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
