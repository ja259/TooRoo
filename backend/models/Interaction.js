const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    interactionType: { type: String, enum: ['like', 'comment', 'share'], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interaction', InteractionSchema);
