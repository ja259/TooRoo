const Interaction = require('./models/Interaction');
const Post = require('./models/Post');

const analyzePreferences = async (userId) => {
    const interactions = await Interaction.find({ userId });

    // Fetch only the post IDs from the interactions
    const postIds = interactions.map(interaction => interaction.postId);

    // Fetch posts that the user has interacted with
    const posts = await Post.find({ _id: { $in: postIds } }).populate('author', 'username email');

    // Extract likes and comments made by the user
    const preferences = {
        likes: posts.filter(post => post.likes.includes(userId)),
        comments: posts.filter(post => post.comments.some(comment => comment.author.toString() === userId))
    };

    return preferences;
};

module.exports = analyzePreferences;

