const path = require('path');
const mongoose = require('mongoose');
mongoose.promise = global.Promise;

module.exports = {
    getAllTopics: require(path.resolve(__dirname, 'getAllTopics')),
    getAllTopicArticles: require(path.resolve(__dirname, 'getAllTopicArticles')),
    getAllArticles: require(path.resolve(__dirname, 'getAllArticles'))
};