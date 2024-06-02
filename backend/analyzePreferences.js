const Interaction = require('./models/Interaction');
const Post = require('./models/Post');

const analyzePreferences = async (userId) => {
    const interactions = await Interaction.find({ userId });
    const postIds = interactions.map(interaction => interaction.postId);
    const posts = await Post.find({ _id: { $in: postIds } });

    const preferences = {
        likes: posts.filter(post => post.likes.includes(userId)),
        comments: posts.filter(post => post.comments.some(comment => comment.author.toString() === userId)),
    };

    return preferences;
};

module.exports = analyzePreferences;
