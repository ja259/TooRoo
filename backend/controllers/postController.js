const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
    const { content, authorId } = req.body;
    if (!content || !authorId) {
        return res.status(400).json({ error: 'Content and author ID are required.' });
    }

    try {
        const author = await User.findById(authorId);
        if (!author) {
            return res.status(404).json({ error: 'Author not found.' });
        }

        const newPost = new Post({ content, author: authorId });
        await newPost.save();
        author.posts.push(newPost._id);
        await author.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.likePost = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }
        await post.save();

        res.status(200).json({ message: 'Like status updated successfully', post });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.commentOnPost = async (req, res) => {
    const { id } = req.params;
    const { userId, content } = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content is required for the comment.' });
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        post.comments.push({ author: userId, content });
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', post });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username email').populate('comments.author', 'username');
        if (!posts.length) {
            return res.status(404).json({ error: 'No posts found.' });
        }
        res.status(200).json({ message: 'Posts retrieved successfully', posts });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await post.remove();
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
