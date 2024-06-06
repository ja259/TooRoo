import React from 'react';
import Post from './Post';

const Feed = ({ user, onPost, onLike, onComment }) => {
    return (
        <div className="feed">
            {user.posts.map(post => (
                <Post
                    key={post._id}
                    post={post}
                    onLike={onLike}
                    onComment={onComment}
                />
            ))}
        </div>
    );
};

export default Feed;
