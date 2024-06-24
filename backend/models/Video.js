const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    comments: [commentSchema],
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Video', videoSchema);

