import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import webPush from 'web-push';
import gridFsStorage from './config/gridFsStorageConfig.js';
import errorHandler from './middlewares/errorHandler.js';
import { authenticate } from './middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import { connectDB, disconnectDB } from './db.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const port = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());
app.use(xss());
app.use(hpp());

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Multer for file uploads
const upload = multer({ storage: gridFsStorage });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/posts', authenticate, postRoutes);
app.use('/api/media', authenticate, mediaRoutes);

// File upload route
app.post('/upload', authenticate, upload.single('file'), (req, res) => {
    res.status(200).send({ message: 'File uploaded successfully', fileName: req.file.filename });
});

// Web Push configuration
webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// Push notification subscription route
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: 'Push Test' });
    webPush.sendNotification(subscription, payload).catch(error => console.error(error.stack));
});

// Error handling middleware
app.use(errorHandler);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

// Socket.io configuration
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('message', (message) => {
        io.emit('message', message);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(port, () => console.log(`Server running on port ${port}`));

// Gracefully disconnect from MongoDB
process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});

export default server;
