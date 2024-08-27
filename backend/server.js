import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import webPush from 'web-push';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { authenticate } from './middlewares/authMiddleware.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import liveRoutes from './routes/liveRoutes.js';
import { connectDB, disconnectDB } from './db.js';
import config from './config/config.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const port = config.port || 5000;

// Security Middleware
app.use(helmet());
app.use(xss());
app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,  // 10 minutes
    max: 100,
});
app.use(limiter);

// CORS Configuration
let corsOrigins = config.corsOrigins;
if (typeof corsOrigins === 'string') {
    corsOrigins = corsOrigins.split(',');
}

app.use(cors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.options('*', cors());

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static Directory for Uploads
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Database Connection
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/posts', authenticate, postRoutes);
app.use('/api/media', authenticate, mediaRoutes);
app.use('/api', liveRoutes);

// Web Push Notification Setup
webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    config.vapidPublicKey,
    config.vapidPrivateKey
);

app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: 'Push Test' });
    webPush.sendNotification(subscription, payload).catch(error => console.error(error.stack));
});

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Serve Static Assets in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(path.resolve(), 'frontend', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(path.resolve(), 'frontend', 'build', 'index.html'));
    });
}

// WebSocket Connection
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('message', (message) => {
        io.emit('message', message);
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start Server
server.listen(port, () => console.log(`Server running on port ${port}`));

// Graceful Shutdown
process.on('SIGINT', async () => {
    await disconnectDB();
    process.exit(0);
});

export default server;
