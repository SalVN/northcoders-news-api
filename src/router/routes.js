const path = require('path');
const express = require('express');
const controllers = require(path.resolve(__dirname, '..', 'controllers'));

const router = express.Router();

router.get('/', function (req, res) {
    res.status(200).send('All good!');
});

router.route('/api/topics')
    .get(controllers.getAllTopics);

router.route('/api/articles')
    .get(controllers.getAllArticles);

router.route('/api/topics/:topic_id/articles')
    .get(controllers.getAllTopicArticles);

router.route('/api/articles/:article_id/comments')
    .get(controllers.getAllArticleComments)
    .post(controllers.addAComment);

router.use(function (req, res, next) {
    return next({ status: 400, message: 'INVALID URL' });
});

module.exports = router;