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
    user = user.toObject();
    user.articles_vote_count = voteCount;
    return user;
};