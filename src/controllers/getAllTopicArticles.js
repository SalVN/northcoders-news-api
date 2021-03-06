const path = require('path');

const { Articles } = require(path.resolve(__dirname, '../..', 'models', 'models'));
const { findArrayCommentCount, addArrayCommentCount } = require(path.resolve(__dirname, '..', 'utilities', 'addCommentCount'));

module.exports = (req, res, next) => {
    const { topic_id } = req.params;
    Articles.find({ belongs_to: topic_id })
        .then(articles => {
            if (articles.length < 1) return next({ status: 404, message: 'TOPIC NOT FOUND' });
            Promise.all(findArrayCommentCount(articles))
                .then((commentCounts) => {
                    const updatedArticles = addArrayCommentCount(articles, commentCounts);
                    res.status(200).json({ articles: updatedArticles });
                });
        })
        .catch(err => {
            next(err);
        });
};