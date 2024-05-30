import React from 'react';
import Post from './Post';
import './Feed.css';

const Feed = ({ user, onPost, onLike, onComment }) => {
    return (
        <div className="feed">
            <form onSubmit={(e) => {
                e.preventDefault();
                const content = e.target.elements.content.value;
                const videoUrl = e.target.elements.videoUrl.value;
                onPost(content, videoUrl);
            }}>
                <textarea name="content" placeholder="What's on your mind?" required></textarea>
                <input type="text" name="videoUrl" placeholder="Video URL" />
                <button type="submit">Post</button>
            </form>
            {user.posts.map(post => (
                <Post key={post._id} post={post} onLike={onLike} onComment={onComment} />
            ))}
        </div>
    );
};

export default Feed;
