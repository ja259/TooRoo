import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    _id: true, 
    timestamps: true 
});

const postSchema = new mongoose.Schema({
    content: { 
        type: String, 
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    videoUrl: { 
        type: String 
    },
    imageUrl: { 
        type: String 
    },
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    comments: [commentSchema]
}, { 
    timestamps: true 
});

export default mongoose.model('Post', postSchema);

