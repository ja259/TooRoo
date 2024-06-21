const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for video comments
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
}, { _id: false });  // Disabling _id creation for subdocuments

// Define the schema for videos
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
    comments: [commentSchema],  // Embed comments schema
}, { 
    timestamps: true 
});

// Export the Video model
module.exports = mongoose.model('Video', videoSchema);

