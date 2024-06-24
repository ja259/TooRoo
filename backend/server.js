require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const gridFsStorage = require('./config/gridFsStorageConfig');
const errorHandler = require('./middlewares/errorHandler');
const { authenticate } = require('./middlewares/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ 
    origin: ['http://localhost:8080', 'https://ja259.github.io'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

const upload = multer({ storage: gridFsStorage });

app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/posts', authenticate, postRoutes);
app.use('/api/media', authenticate, mediaRoutes);

app.post('/upload', authenticate, upload.single('file'), (req, res) => {
    res.status(200).send({ message: 'File uploaded successfully', fileName: req.file.filename });
});

app.use(errorHandler);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

app.listen(port, () => console.log(`Server running on port ${port}`));

