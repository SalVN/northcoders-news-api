const path = require('path');
const express = require('express');
const controllers = require(path.resolve(__dirname, '..', 'controllers'));

const router = express.Router();

router.get('/', function (req, res) {
  res.status(200).send('All good!');
});

router.route('/api/topics')
    .get(controllers.getAllTopics);

router.route('/api/topics/:topic_id/articles')
    .get(controllers.getAllTopicArticles);

router.use(function (req, res, next) {
    return next({ status: 400, message: 'INVALID URL' });
});

module.exports = router;