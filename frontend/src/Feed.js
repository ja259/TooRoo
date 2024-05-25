import React, { useState } from 'react';

const Feed = ({ user, onPost, onLike }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onPost(content);
        setContent('');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind?" required />
                <button type="submit">Post</button>
            </form>
            <div>
                {user.posts.map(post => (
                    <div key={post._id}>
                        <p>{post.content}</p>
                        <button onClick={() => onLike(post._id)}>Like ({post.likes.length})</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Feed;
