const path = require('path');
const mongoose = require('mongoose');
mongoose.promise = global.Promise;

module.exports = {
    getAllTopics: require(path.resolve(__dirname, 'getAllTopics')),
    getAllTopicArticles: require(path.resolve(__dirname, 'getAllTopicArticles')),
    getAllArticles: require(path.resolve(__dirname, 'getAllArticles')),
    getAllArticleComments: require(path.resolve(__dirname, 'getAllArticleComments')),
    addAComment: require(path.resolve(__dirname, 'addAComment')),
    voteArticlesUpOrDown: require(path.resolve(__dirname, 'voteArticlesUpOrDown')),
    voteCommentsUpOrDown: require(path.resolve(__dirname, 'voteCommentsUpOrDown')),
    deleteComment: require(path.resolve(__dirname, 'deleteComment')),
    getUserByUsername: require(path.resolve(__dirname, 'getUserByUsername'))
};