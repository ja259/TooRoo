require('dotenv').config();
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

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    notifications: [{ type: String }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        content: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    videoUrl: { type: String },
});

const Post = mongoose.model('Post', postSchema);

const interactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    interactionType: { type: String, enum: ['like', 'comment', 'share', 'view'] },
    createdAt: { type: Date, default: Date.now }
});

const Interaction = mongoose.model('Interaction', interactionSchema);

// Storage for multer
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
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
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
});

// User login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials!' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user });
});

// Forgot password
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
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
});

// Reset password
app.post('/reset-password/:token', async (req, res) => {
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
});

// Fetch user profile
app.get('/user/me', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).populate('posts');
    res.status(200).json(user);
});

// Fetch a user's profile
app.get('/user/:id', async (req, res) => {
    const user = await User.findById(req.params.id).populate('posts');
    if (!user) return res.status(404).json({ message: 'User not found!' });
    res.status(200).json(user);
});

// Update user profile
app.put('/user/:id', async (req, res) => {
    const { username, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { username, bio, avatar }, { new: true });
    res.status(200).json(user);
});

// Follow a user
app.post('/user/:id/follow', async (req, res) => {
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
});

// Unfollow a user
app.post('/user/:id/unfollow', async (req, res) => {
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
});

// Create a new post
app.post('/post', async (req, res) => {
    const { content, authorId, videoUrl } = req.body;
    const newPost = new Post({ content, author: authorId, videoUrl });
    await newPost.save();

    const author = await User.findById(authorId);
    author.posts.push(newPost);
    await author.save();

    res.status(201).json(newPost);
});

// Like a post
app.post('/post/:id/like', async (req, res) => {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    post.likes.push(userId);
    await post.save();
    res.status(200).json(post);
});

// Comment on a post
app.post('/post/:id/comment', async (req, res) => {
    const { userId, content } = req.body;
    const post = await Post.findById(req.params.id);
    post.comments.push({ author: userId, content });
    await post.save();
    res.status(201).json(post);
});

// Track interactions
app.post('/interact', async (req, res) => {
    const { userId, postId, interactionType } = req.body;
    const interaction = new Interaction({ userId, postId, interactionType });
    await interaction.save();
    res.status(201).json(interaction);
});

// Recommend content
app.get('/recommend/:userId', async (req, res) => {
    const { userId } = req.params;
    const recommendedPosts = await recommendContent(userId);
    res.status(200).json(recommendedPosts);
});

// Search users and posts
app.get('/search', async (req, res) => {
    const { query } = req.query;
    const users = await User.find({ username: { $regex: query, $options: 'i' } });
    const posts = await Post.find({ content: { $regex: query, $options: 'i' } });
    res.status(200).json({ users, posts });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
