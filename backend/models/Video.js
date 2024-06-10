const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    videoUrl: { type: String, required: true },
    description: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);

