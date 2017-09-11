const path = require('path');

const { Articles } = require(path.resolve(__dirname, '../..', 'models', 'models'));
const {findArrayCommentCount, addArrayCommentCount} = require(path.resolve(__dirname, '..', 'utilities', 'addCommentCount'));

module.exports = (req, res, next) => {
    Articles.find({})
        .then(articles => {
            Promise.all(findArrayCommentCount(articles))
                .then(commentCounts => {
                    const updatedArticles = addArrayCommentCount(articles, commentCounts);
                    res.status(200).json({ articles: updatedArticles });
                });
        })
        .catch(err => {
            next(err);
        });
};