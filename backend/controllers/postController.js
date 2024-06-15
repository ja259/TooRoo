const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
    const { content, authorId } = req.body;
    if (!content || !authorId) {
        return res.status(400).json({ message: 'Content and author ID are required.' });
    }

    try {
        const author = await User.findById(authorId);
        if (!author) {
            return res.status(404).json({ message: 'Author not found.' });
        }

        const newPost = new Post({ content, author: authorId });
        await newPost.save();

        author.posts.push(newPost._id);
        await author.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', details: error.toString() });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username email').populate('comments.author', 'username');
        res.json({ message: 'Posts retrieved successfully', posts });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', details: error.toString() });
    }
};

exports.getTimelinePosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username profilePicture').sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve timeline posts', error: error.message });
    }
};

exports.getYouAllVideos = async (req, res) => {
    try {
        const videos = await Post.find({ videoUrl: { $exists: true } })
                                 .populate('author', 'username avatar')
                                 .sort({ createdAt: -1 })
                                 .limit(20);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve videos', error: error.message });
    }
};

exports.getFollowingVideos = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const videos = await Post.find({ author: { $in: user.following }, videoUrl: { $exists: true } })
                                 .populate('author', 'username avatar')
                                 .sort({ createdAt: -1 })
                                 .limit(20);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve following videos', error: error.message });
    }
};

exports.likePost = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const post = await Post.findById(id);
        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }
        await post.save();
        res.json({ message: 'Like status updated successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', details: error.toString() });
    }
};

exports.commentOnPost = async (req, res) => {
    const { id } = req.params;
    const { userId, content } = req.body;

    try {
        const post = await Post.findById(id);
        const comment = { author: userId, content };
        post.comments.push(comment);
        await post.save();
        res.json({ message: 'Comment added successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', details: error.toString() });
    }
};

exports.deletePost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findByIdAndRemove(id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};
