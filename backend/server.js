require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

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
    const { content, authorId } = req.body;
    const newPost = new Post({ content, author: authorId });
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
