import React from 'react';
import Post from './Post';
import PropTypes from 'prop-types';
import './Feed.css';

const Feed = ({ user, onPost, onLike, onComment }) => {
    return (
        <div className="feed">
            {user.posts.map(post => (
                <Post
                    key={post._id}
                    post={post}
                    onLike={() => onLike(post._id)}
                    onComment={(comment) => onComment(post._id, comment)}
                />
            ))}
        </div>
    );
};

Feed.propTypes = {
    user: PropTypes.shape({
        posts: PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                content: PropTypes.string.isRequired
            })
        ).isRequired
    }).isRequired,
    onPost: PropTypes.func.isRequired,
    onLike: PropTypes.func.isRequired,
    onComment: PropTypes.func.isRequired
};

export default Feed;
