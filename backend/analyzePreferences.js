const Interaction = require('./models/Interaction');

const analyzePreferences = async (userId) => {
    try {
        const interactions = await Interaction.find({ userId }).lean();

        const preferences = interactions.reduce((acc, interaction) => {
            if (!acc[interaction.postId]) {
                acc[interaction.postId] = 0;
            }
            acc[interaction.postId] += 1;
            return acc;
        }, {});

        return preferences;
    } catch (error) {
        console.error('Error analyzing preferences:', error);
        throw error;
    }
};

module.exports = analyzePreferences;
