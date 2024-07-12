import * as chai from 'chai';

const { expect } = chai;

describe('Data Structure Tests', () => {
    const data = {
        "users": [
            {
                "_id": "userId",
                "username": "username",
                "avatar": "avatarUrl",
                "bio": "User bio",
                "followers": ["followerId1", "followerId2"],
                "following": ["followingId1", "followingId2"],
                "posts": ["postId1", "postId2"]
            }
        ],
        "posts": [
            {
                "_id": "postId",
                "content": "post content",
                "videoUrl": "videoUrl",
                "imageUrl": "imageUrl",
                "author": {
                    "_id": "authorId",
                    "username": "authorUsername",
                    "avatar": "authorAvatarUrl"
                },
                "likes": ["likeId1", "likeId2"],
                "comments": [
                    {
                        "author": {
                            "_id": "commentAuthorId",
                            "username": "commentAuthorUsername",
                            "avatar": "commentAuthorAvatarUrl"
                        },
                        "content": "comment content"
                    }
                ]
            }
        ]
    };

    describe('Users Structure', () => {
        it('should have a users array', () => {
            expect(data).to.have.property('users').that.is.an('array');
        });

        it('each user should have required fields', () => {
            data.users.forEach(user => {
                expect(user).to.be.an('object');
                expect(user).to.have.property('_id').that.is.a('string');
                expect(user).to.have.property('username').that.is.a('string');
                expect(user).to.have.property('avatar').that.is.a('string');
                expect(user).to.have.property('bio').that.is.a('string');
                expect(user).to.have.property('followers').that.is.an('array');
                expect(user).to.have.property('following').that.is.an('array');
                expect(user).to.have.property('posts').that.is.an('array');
            });
        });

        it('followers, following, and posts should contain strings', () => {
            data.users.forEach(user => {
                user.followers.forEach(follower => {
                    expect(follower).to.be.a('string');
                });
                user.following.forEach(following => {
                    expect(following).to.be.a('string');
                });
                user.posts.forEach(post => {
                    expect(post).to.be.a('string');
                });
            });
        });
    });

    describe('Posts Structure', () => {
        it('should have a posts array', () => {
            expect(data).to.have.property('posts').that.is.an('array');
        });

        it('each post should have required fields', () => {
            data.posts.forEach(post => {
                expect(post).to.be.an('object');
                expect(post).to.have.property('_id').that.is.a('string');
                expect(post).to.have.property('content').that.is.a('string');
                expect(post).to.have.property('videoUrl').that.is.a('string');
                expect(post).to.have.property('imageUrl').that.is.a('string');
                expect(post).to.have.property('author').that.is.an('object');
                expect(post).to.have.property('likes').that.is.an('array');
                expect(post).to.have.property('comments').that.is.an('array');
            });
        });

        it('author should have required fields', () => {
            data.posts.forEach(post => {
                const author = post.author;
                expect(author).to.have.property('_id').that.is.a('string');
                expect(author).to.have.property('username').that.is.a('string');
                expect(author).to.have.property('avatar').that.is.a('string');
            });
        });

        it('likes should contain strings', () => {
            data.posts.forEach(post => {
                post.likes.forEach(like => {
                    expect(like).to.be.a('string');
                });
            });
        });

        it('comments should have required fields', () => {
            data.posts.forEach(post => {
                post.comments.forEach(comment => {
                    expect(comment).to.be.an('object');
                    expect(comment).to.have.property('content').that.is.a('string');
                    const author = comment.author;
                    expect(author).to.have.property('_id').that.is.a('string');
                    expect(author).to.have.property('username').that.is.a('string');
                    expect(author).to.have.property('avatar').that.is.a('string');
                });
            });
        });
    });
});
