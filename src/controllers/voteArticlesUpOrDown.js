const path = require('path');
const { Articles } = require(path.resolve(__dirname, '../..', 'models', 'models'));
const { findOneCommentCount, addOneCommentCount } = require(path.resolve(__dirname, '..', 'utilities', 'addCommentCount'));
const defineQueryVote = require(path.resolve(__dirname, '..', 'utilities', 'defineQueryVote'));

module.exports = (req, res, next) => {
    const { article_id } = req.params;
    const vote = defineQueryVote(req, res, next);
    Articles.findOneAndUpdate({ _id: article_id }, { $inc: { votes: vote } }, { new: true })
        .then(article => {
            article = article.toObject();
            findOneCommentCount (article)
                .then(commentCount => {
                    let updatedArticle = addOneCommentCount(article, commentCount);
                    res.status(200).json({ article: updatedArticle });
                });
        })
        .catch(err => {
            if (err.name === 'CastError') return next({ status: 404, message: 'ARTICLE NOT FOUND' });
            next(err);
        });
};