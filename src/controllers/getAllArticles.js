const path = require('path');

const { Articles } = require(path.resolve(__dirname, '../..', 'models', 'models'));
const {findArticleCommentCount, addArticleCommentCount} = require(path.resolve(__dirname, '..', 'utilities', 'addCommentCount'));

module.exports = (req, res, next) => {
    Articles.find({})
        .then(articles => {
            Promise.all(findArticleCommentCount(articles))
                .then(commentCounts => {
                    const updatedArticles = addArticleCommentCount(articles, commentCounts);
                    res.status(200).json({ articles: updatedArticles });
                });
        })
        .catch(err => {
            next(err);
        });
};