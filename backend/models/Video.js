import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema({
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
}, { _id: false });

const videoSchema = new Schema({
    author: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    videoUrl: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    likes: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    comments: [commentSchema]
}, { 
    timestamps: true 
});

videoSchema.pre('save', function(next) {
    if (!this.videoUrl) {
        next(new Error('Video URL is required'));
    } else {
        next();
    }
});

export default mongoose.model('Video', videoSchema);
