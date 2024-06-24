import React from 'react';
import './Post.css';

const Post = ({ post }) => {
    if (!post || !post.author || !post.author.profilePicture) {
        return null;
    }

    return (
        <div className="post">
            <div className="post-header">
                <img src={post.author.profilePicture} alt={post.author.username} className="post-author-img" />
                <span className="post-author">{post.author.username}</span>
            </div>
            <div className="post-content">
                <p>{post.content}</p>
                {post.videoUrl && <video src={post.videoUrl} controls className="post-video"></video>}
            </div>
            <div className="post-footer">
                <button className="like-button">Like</button>
                <button className="comment-button">Comment</button>
            </div>
        </div>
    );
};

export default Post;
