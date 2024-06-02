const Interaction = require('./models/Interaction');

async function analyzePreferences(userId) {
    try {
        const interactions = await Interaction.find({ userId });
        const postInteractions = interactions.reduce((acc, interaction) => {
            if (!acc[interaction.postId]) {
                acc[interaction.postId] = { likes: 0, comments: 0, shares: 0 };
            }
            acc[interaction.postId][interaction.interactionType] += 1;
            return acc;
        }, {});

        const sortedPostIds = Object.keys(postInteractions).sort((a, b) => {
            const aInteractions = postInteractions[a];
            const bInteractions = postInteractions[b];
            const aScore = aInteractions.likes + aInteractions.comments + aInteractions.shares;
            const bScore = bInteractions.likes + bInteractions.comments + bInteractions.shares;
            return bScore - aScore;
        });

        return sortedPostIds;
    } catch (error) {
        throw new Error('Error analyzing preferences');
    }
}

module.exports = analyzePreferences;
