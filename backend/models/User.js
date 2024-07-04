import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    },
    securityQuestion1: {
        type: String,
        required: true
    },
    securityAnswer1: {
        type: String,
        required: true
    },
    securityQuestion2: {
        type: String,
        required: true
    },
    securityAnswer2: {
        type: String,
        required: true
    },
    securityQuestion3: {
        type: String,
        required: true
    },
    securityAnswer3: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        trim: true
    },
    avatar: {
        type: String
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    notifications: [{
        type: String
    }],
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
}, {
    timestamps: true
});

userSchema.index({ email: 1, phone: 1 }, { unique: true });

export default mongoose.model('User', userSchema);
