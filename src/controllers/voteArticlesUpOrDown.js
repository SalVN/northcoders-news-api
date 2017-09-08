const path = require('path');
const { Articles } = require(path.resolve(__dirname, '../..', 'models', 'models'));
// const { findArticleCommentCount } = require(path.resolve(__dirname, '..', 'utilities', 'addCommentCount'));
const defineQueryVote = require(path.resolve(__dirname, '..', 'utilities', 'defineQueryVote'));
const { Comments } = require(path.resolve(__dirname, '../..', 'models', 'models'));

module.exports = (req, res, next) => {
    const { article_id } = req.params;
    const vote = defineQueryVote(req, res, next);
    Articles.findOneAndUpdate({ _id: article_id }, { $inc: { votes: vote } }, { new: true })
        .then(article => {
            article = article.toObject();
            Comments.count({ belongs_to: article._id })
                .then(commentCount => {
                    article.comment_count = commentCount;
                    res.status(200).json({ article });
                });
        })
        .catch(err => {
            if (err.name === 'CastError') return next({ status: 404, message: 'ARTICLE NOT FOUND' });
            next(err);
        });
};