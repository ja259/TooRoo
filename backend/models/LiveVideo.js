// models/LiveVideo.js
import mongoose from 'mongoose';

const liveVideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isLive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    endedAt: { type: Date }
}, { timestamps: true });

const LiveVideo = mongoose.model('LiveVideo', liveVideoSchema);

export default LiveVideo;
