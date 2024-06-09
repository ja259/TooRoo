require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

// Configuration for GridFS
const gridFsStorage = require('./config/gridFsStorageConfig');

// Utility modules
const emailService = require('./utils/emailService'); // Assuming this exports a callable function

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

// Apply middleware and routes
app.use('/api/auth', authRoutes); // Attach auth routes
authRoutes.post('/register', [validateRegister, register]); // Applying validation middleware for registration
authRoutes.post('/login', [validateLogin, login]); // Applying validation middleware for login
authRoutes.post('/reset-password', [validateResetPassword, resetPassword]); // Applying validation middleware for password reset

app.use('/api/users', authenticate, userRoutes); // Routes for user actions
app.use('/api/posts', authenticate, postRoutes); // Routes for posts
app.use('/api/media', authenticate, mediaRoutes); // Routes for media

app.post('/upload', upload.single('file'), (req, res) => {
    res.status(200).send({ message: 'File uploaded successfully', fileName: req.file.filename });
});

app.use(errorHandler); // Error handling

app.listen(port, () => console.log(`Server running on port ${port}`));
