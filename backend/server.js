import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import webPush from 'web-push';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import { connectDB, disconnectDB } from './db.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { authenticate } from './middlewares/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import liveRoutes from './routes/liveRoutes.js';
import config from './config/config.js';

dotenv.config();  // Load environment variables from .env file

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const port = config.port || 5000;

// Security Middleware
app.use(helmet());  // Secure app by setting various HTTP headers
app.use(xss());  // Sanitize user input
app.use(hpp());  // Protect against HTTP Parameter Pollution

// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,  // 10 minutes
    max: 100,  // Limit each IP to 100 requests per windowMs
});
app.use(limiter);  // Apply rate limiting to all requests

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

app.options('*', cors());  // Handle preflight requests

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static Directory for Uploads
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Database Connection
connectDB();  // Connect to MongoDB

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticate, userRoutes);  // Authenticate user before accessing these routes
app.use('/api/posts', authenticate, postRoutes);  // Authenticate user before accessing these routes
app.use('/api/media', authenticate, mediaRoutes);  // Authenticate user before accessing these routes
app.use('/api', liveRoutes);  // Live routes, no authentication required by default

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
app.use(notFound);  // Handle 404 errors
app.use(errorHandler);  // Custom error handler for all other errors

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
        io.emit('message', message);  // Broadcast message to all connected clients
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start Server
server.listen(port, () => console.log(`Server running on port ${port}`));

// Graceful Shutdown
process.on('SIGINT', async () => {
    await disconnectDB();  // Disconnect from MongoDB
    process.exit(0);  // Exit process
});

export default server;
