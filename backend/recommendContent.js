import analyzePreferences from './analyzePreferences.js';
import Post from './models/Post.js';
import Video from './models/Video.js';
import LiveVideo from './models/LiveVideo.js';
import User from './models/User.js';
import mongoose from 'mongoose';

const recommendContent = async (userId) => {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('User ID is required and must be valid');
    }

    try {
        const preferences = await analyzePreferences(userId);

        // Collect all the IDs of content already interacted with
        const likedPostIds = preferences.likedPosts.map(post => post._id);
        const commentedPostIds = preferences.commentedPosts.map(post => post._id);
        const likedVideoIds = preferences.likedVideos.map(video => video._id);
        const viewedLiveVideoIds = preferences.viewedLiveVideos.map(video => video._id);

        // Get user profile for collaborative filtering
        const user = await User.findById(userId).populate('following');

        // Use collaborative filtering based on similar users' preferences
        const similarUsers = await User.find({
            _id: { $in: user.following }
        });

        const similarUserPreferences = await Promise.all(similarUsers.map(async (similarUser) => {
            return analyzePreferences(similarUser._id);
        }));

        // Aggregate similar users' preferences
        const aggregatedPreferences = {
            likedPosts: [],
            likedVideos: [],
            viewedLiveVideos: []
        };

        similarUserPreferences.forEach(userPreferences => {
            aggregatedPreferences.likedPosts.push(...userPreferences.likedPosts);
            aggregatedPreferences.likedVideos.push(...userPreferences.likedVideos);
            aggregatedPreferences.viewedLiveVideos.push(...userPreferences.viewedLiveVideos);
        });

        // Recommend posts that are not already interacted with
        const recommendedPosts = await Post.find({
            _id: { $nin: [...likedPostIds, ...commentedPostIds] }
        }).populate('author', 'username profilePicture').sort({ createdAt: -1 }).limit(10);

        // Recommend videos that are not already liked
        const recommendedVideos = await Video.find({
            _id: { $nin: likedVideoIds }
        }).populate('author', 'username profilePicture').sort({ createdAt: -1 }).limit(10);

        // Recommend live videos that are not already viewed
        const recommendedLiveVideos = await LiveVideo.find({
            _id: { $nin: viewedLiveVideoIds },
            isLive: true
        }).populate('author', 'username profilePicture').sort({ createdAt: -1 }).limit(5);

        // Add collaborative filtering content
        const collaborativePosts = aggregatedPreferences.likedPosts.slice(0, 5); // Top 5 liked posts by similar users
        const collaborativeVideos = aggregatedPreferences.likedVideos.slice(0, 5); // Top 5 liked videos by similar users
        const collaborativeLiveVideos = aggregatedPreferences.viewedLiveVideos.slice(0, 3); // Top 3 live videos viewed by similar users

        return {
            recommendedPosts,
            recommendedVideos,
            recommendedLiveVideos,
            collaborativePosts,
            collaborativeVideos,
            collaborativeLiveVideos
        };
    } catch (error) {
        console.error('Error recommending content:', error);
        throw new Error('Failed to recommend content');
    }
};

export default recommendContent;
