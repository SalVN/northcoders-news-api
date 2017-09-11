const path = require('path');
const { Comments } = require(path.resolve(__dirname, '../..', 'models', 'models'));

exports.getUserComments = function (user) {
    return Comments.find({created_by: user});
};

exports.calculateUserCommentVotes = function (comments) {
    return comments.reduce((acc, comment) => {
        acc += comment.votes;
        return acc;
    }, 0);
};

exports.addUserCommentVotes = function (user, voteCount) {
    user.comments_vote_count = voteCount;
    return user;
};