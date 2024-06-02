import React from 'react';
import './Post.css';

const Post = ({ post, onLike, onComment }) => {
    const handleLike = () => {
        onLike(post._id);
    };

    const handleComment = (e) => {
        if (e.key === 'Enter') {
            onComment(post._id, e.target.value);
            e.target.value = '';
        }
    };

    return (
        <div className="post">
            <div className="post-header">
                <img src={post.author.profilePicture || 'default-profile.png'} alt="Profile" />
                <div>
                    <span className="username">{post.author.username}</span>
                    <span className="timestamp">{new Date(post.createdAt).toLocaleString()}</span>
                </div>
            </div>
            <div className="post-content">
                <p>{post.content}</p>
                {post.videoUrl && <video src={post.videoUrl} controls />}
            </div>
            <div className="post-actions">
                <button onClick={handleLike}>Like ({post.likes.length})</button>
                <button onClick={() => alert('Comment button clicked')}>Comment</button>
                <button onClick={() => alert('Share button clicked')}>Share</button>
            </div>
            <div className="post-comments">
                {post.comments.map(comment => (
                    <div key={comment._id} className="comment">
                        <span className="username">{comment.author.username}:</span> {comment.content}
                    </div>
                ))}
                <input
                    type="text"
                    placeholder="Add a comment..."
                    onKeyPress={handleComment}
                />
            </div>
        </div>
    );
};

export default Post;
