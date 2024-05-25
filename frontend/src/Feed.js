import React, { useState } from 'react';

const Feed = ({ user, onPost, onLike, onComment }) => {
    const [content, setContent] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [comment, setComment] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onPost(content, videoUrl);
        setContent('');
        setVideoUrl('');
    };

    const handleComment = (postId) => {
        onComment(postId, comment);
        setComment('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind?" />
                <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Video URL" />
                <button type="submit">Post</button>
            </form>
            <div>
                {user.posts.map(post => (
                    <div key={post._id}>
                        <p>{post.content}</p>
                        {post.videoUrl && <video src={post.videoUrl} controls />}
                        <button onClick={() => onLike(post._id)}>Like ({post.likes.length})</button>
                        <div>
                            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" />
                            <button onClick={() => handleComment(post._id)}>Comment</button>
                        </div>
                        <div>
                            {post.comments.map(comment => (
                                <div key={comment._id}>
                                    <p>{comment.content} - {comment.author.username}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Feed;
