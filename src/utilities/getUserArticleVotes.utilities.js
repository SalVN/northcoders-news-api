const path = require('path');
const { Articles } = require(path.resolve(__dirname, '../..', 'models', 'models'));

exports.getUserArticles = function (user) {
    return Articles.find({created_by: user});
};

exports.calculateUserArticleVotes = function (articles) {
    return articles.reduce((acc, article) => {
        acc += article.votes;
        return acc;
    }, 0);
};

exports.addUserArticleVotes = function (user, voteCount) {
    user.articles_vote_count = voteCount;
    return user;
};

exports.getArrayArticles = function (array) {
    return array.map(user => {
        return Articles.find({ created_by: user._id });
    });
};

function calculateUserArticleVotes (articles) {
    return articles.reduce((acc, article) => {
        acc += article.votes;
        return acc;
    }, 0);
}

exports.addArrayCommentVotes = function (users, articles) {
    return users.map((el, i) => {
        const votes = calculateUserArticleVotes(articles[i]);
        el = el.toObject();
        el.comment_count = votes;
        return el;
    });
};