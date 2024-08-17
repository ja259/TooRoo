import Post from '../models/Post.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const createPost = async (req, res) => {
    const { content, authorId } = req.body;

    if (!content || !authorId) {
        return res.status(400).json({ message: 'Content and author ID are required.' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).json({ message: 'Invalid author ID' });
        }

        const author = await User.findById(authorId);
        if (!author) {
            return res.status(404).json({ message: 'Author not found.' });
        }

        const newPost = new Post({
            content,
            author: authorId,
            videoUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
        });

        await newPost.save();
        author.posts.push(newPost._id);
        await author.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username email')
            .populate('comments.author', 'username');

        if (!posts.length) {
            return res.status(404).json({ message: 'No posts found.' });
        }

        res.json({ message: 'Posts retrieved successfully', posts });
    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const getTimelinePosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username profilePicture')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error('Failed to retrieve posts:', error);
        res.status(500).json({ message: 'Failed to retrieve posts', error: error.message });
    }
};

export const getYouAllVideos = async (req, res) => {
    try {
        const videos = await Post.find({ videoUrl: { $exists: true } })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(videos);
    } catch (error) {
        console.error('Error fetching videos for You All section:', error);
        res.status(500).json({ message: 'Failed to retrieve videos', error: error.message });
    }
};

export const getFollowingVideos = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const videos = await Post.find({
            author: { $in: user.following },
            videoUrl: { $exists: true }
        })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(videos);
    } catch (error) {
        console.error('Error fetching following videos:', error);
        res.status(500).json({ message: 'Failed to retrieve following videos', error: error.message });
    }
};

export const likePost = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

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
        console.error('Error liking post:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const commentOnPost = async (req, res) => {
    const { id } = req.params;
    const { userId, content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Content is required for the comment.' });
    }

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

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
        console.error('Error commenting on post:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

export const deletePost = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await Post.findByIdAndRemove(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
