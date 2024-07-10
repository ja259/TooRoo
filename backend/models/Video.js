import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    videoUrl: { type: String, required: true },
    description: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);

export default Video;
