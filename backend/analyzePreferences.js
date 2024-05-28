const Interaction = require('./models/Interaction');

const analyzePreferences = async (userId) => {
    const interactions = await Interaction.find({ userId });
    const preferences = {};

    interactions.forEach(interaction => {
        const postId = interaction.postId.toString();
        if (!preferences[postId]) {
            preferences[postId] = { likes: 0, comments: 0, shares: 0, views: 0 };
        }
        preferences[postId][interaction.interactionType]++;
    });

    return preferences;
};

module.exports = analyzePreferences;
