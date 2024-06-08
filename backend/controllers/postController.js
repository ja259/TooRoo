const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
exports.createPost = async (req, res) => {
    const { content, authorId } = req.body;
    if (!content || !authorId) {
        return res.status(400).json({ message: 'Content and author ID are required.' });
    }

    try {
        const newPost = new Post({ content, author: authorId });
        await newPost.save();

        const author = await User.findById(authorId);
        if (!author) {
            return res.status(404).json({ message: 'Author not found.' });
        }

        author.posts.push(newPost._id);
        await author.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Like or unlike a post
exports.likePost = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }
        await post.save();

        res.status(200).json({ message: 'Like status changed successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Comment on a post
exports.commentOnPost = async (req, res) => {
    const { id } = req.params;
    const { userId, content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Content is required for the comment.' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        post.comments.push({ author: userId, content });
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author').populate('comments.author');
        res.status(200).json({ message: 'Posts retrieved successfully', posts });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
