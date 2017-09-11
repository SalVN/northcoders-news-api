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

exports.getArrayComments = function (array) {
    return array.map(user => {
        return Comments.find({ created_by: user.username });
    });
};

function calculateUserCommentVotes (comments) {
    return comments.reduce((acc, comment) => {
        acc += comment.votes;
        return acc;
    }, 0);
}

exports.addArrayCommentVotes = function (users, articles) {
    return users.map((el, i) => {
        const votes = calculateUserCommentVotes(articles[i]);
        el.comments_vote_count = votes;
        return el;
    });
};
