const mongoose = require('mongoose');

// Define the schema for comments
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

// Define the schema for posts
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

// Export the Post model
module.exports = mongoose.model('Post', postSchema);

