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

        const newPost = new Post({
            content,
            author: authorId
        });
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
        if (!posts.length) {
            return res.status(404).json({ message: 'No posts found.' });
        }
        res.json({ message: 'Posts retrieved successfully', posts });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', details: error.toString() });
    }
};

exports.getTimelinePosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'username profilePicture'); // Adjust the populated fields as needed for your timeline
        res.json(posts);
    } catch (error) {
        console.error('Failed to retrieve posts:', error);
        res.status(500).send('Failed to retrieve posts');
    }
};

exports.getYouAllVideos = async (req, res) => {
    try {
        // Example: Fetch posts that have a videoUrl and maybe some specific tags or are popular
        const videos = await Post.find({ videoUrl: { $exists: true } }).populate('author', 'username profilePicture');
        res.json({ message: 'Videos retrieved successfully', videos });
    } catch (error) {
        console.error('Failed to retrieve videos:', error);
        res.status(500).send('Failed to retrieve videos');
    }
};

exports.getFollowingVideos = async (req, res) => {
    const userId = req.user._id;  // Assuming there's user info in req.user from the authentication middleware
    try {
        // Example: Fetch posts from users the current user is following
        const user = await User.findById(userId).populate('following');
        const followingIds = user.following.map(user => user._id);
        const videos = await Post.find({ author: { $in: followingIds }, videoUrl: { $exists: true } }).populate('author', 'username profilePicture');
        res.json({ message: 'Following videos retrieved successfully', videos });
    } catch (error) {
        console.error('Failed to retrieve following videos:', error);
        res.status(500).send('Failed to retrieve following videos');
    }
};

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

        res.json({ message: 'Like status updated successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', details: error.toString() });
    }
};

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

        const comment = {
            author: userId,
            content
        };
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
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.toString() });
    }
};

