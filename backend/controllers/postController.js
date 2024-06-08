const Post = require('./models/Post');
const User = require('./models/User');

exports.createPost = async (req, res) => {
    const { content, authorId } = req.body;
    try {
        const newPost = new Post({ content, author: authorId });
        await newPost.save();

        const author = await User.findById(authorId);
        author.posts.push(newPost._id);
        await author.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.likePost = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const post = await Post.findById(id);
        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
        } else {
            post.likes.pull(userId);
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.commentOnPost = async (req, res) => {
    const { id } = req.params;
    const { userId, content } = req.body;
    try {
        const post = await Post.findById(id);
        post.comments.push({ author: userId, content });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
