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
const analyzePreferences = require('./analyzePreferences');
const recommendContent = require('./recommendContent');

const User = require('./models/User');
const Post = require('./models/Post');
const Interaction = require('./models/Interaction');
const Video = require('./models/Video'); // Add this line

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: ['http://localhost:3000', 'https://ja259.github.io'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Storage for multer
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    options: {},
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

// User registration
app.post('/register', async (req, res) => {
    const { username, email, password, phone } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, phone, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Username, email or phone number already exists!' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

// User login
app.post('/login', async (req, res) => {
    const { emailOrPhone, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
        });
        if (!user) return res.status(404).json({ message: 'User not found!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials!' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Forgot password
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found!' });

        const token = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'TooRoo Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${req.headers.host}/reset-password/${token}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.status(200).json({ message: 'Email sent successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Reset password
app.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch user profile
app.get('/user/me', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).populate('posts');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Fetch a user's profile
app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('posts');
        if (!user) return res.status(404).json({ message: 'User not found!' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user profile
app.put('/user/:id', async (req, res) => {
    const { username, bio, avatar } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { username, bio, avatar }, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Follow a user
app.post('/user/:id/follow', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        const userToFollow = await User.findById(req.params.id);
        if (!user || !userToFollow) return res.status(404).json({ message: 'User not found!' });

        user.following.push(userToFollow._id);
        userToFollow.followers.push(user._id);

        user.notifications.push(`You are now following ${userToFollow.username}`);
        userToFollow.notifications.push(`${user.username} is now following you`);

        await user.save();
        await userToFollow.save();

        res.status(200).json({ message: 'Followed successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Unfollow a user
app.post('/user/:id/unfollow', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        const userToUnfollow = await User.findById(req.params.id);
        if (!user || !userToUnfollow) return res.status(404).json({ message: 'User not found!' });

        user.following.pull(userToUnfollow._id);
        userToUnfollow.followers.pull(user._id);

        await user.save();
        await userToUnfollow.save();

        res.status(200).json({ message: 'Unfollowed successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new post
app.post('/post', async (req, res) => {
    const { content, authorId, videoUrl } = req.body;
    try {
        const newPost = new Post({ content, author: authorId, videoUrl });
        await newPost.save();

        const author = await User.findById(authorId);
        author.posts.push(newPost);
        await author.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Like a post
app.post('/post/:id/like', async (req, res) => {
    const { userId } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(userId)) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Comment on a post
app.post('/post/:id/comment', async (req, res) => {
    const { userId, content } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        post.comments.push({ author: userId, content });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Track interactions
app.post('/interact', async (req, res) => {
    const { userId, postId, interactionType } = req.body;
    try {
        const interaction = new Interaction({ userId, postId, interactionType });
        await interaction.save();
        res.status(201).json(interaction);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Recommend content
app.get('/recommend/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const recommendedPosts = await recommendContent(userId);
        res.status(200).json(recommendedPosts);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Search users and posts
app.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const users = await User.find({ username: { $regex: query, $options: 'i' } });
        const posts = await Post.find({ content: { $regex: query, $options: 'i' } });
        res.status(200).json({ users, posts });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// AR Filters
app.post('/ar-filters', async (req, res) => {
    // Logic for AR filters
    res.status(200).json({ message: 'AR filter applied!' });
});

// Virtual Events
app.post('/virtual-events', async (req, res) => {
    // Logic for virtual events
    res.status(200).json({ message: 'Virtual event created!' });
});

// Get all videos for "You All" page
app.get('/you-all-videos', async (req, res) => {
    try {
        const videos = await Video.find().populate('author');
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching videos' });
    }
});

// Get videos from followed users for "Following" page
app.get('/following-videos', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).populate('following');
        const followingIds = user.following.map(follow => follow._id);
        const videos = await Video.find({ author: { $in: followingIds } }).populate('author');
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching videos' });
    }
});

// Fetch posts for the Timeline
app.get('/timeline-posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('author');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
