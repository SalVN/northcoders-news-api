const path = require('path');

const { Articles } = require(path.resolve(__dirname, '../..', 'models', 'models'));
const { Comments } = require(path.resolve(__dirname, '../..', 'models', 'models'));

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

function findArticleCommentCount(articles) {
    return articles.map(user => {
        return Comments.count({ belongs_to: user._id });
    });
}

function addArticleCommentCount (articles, commentCounts) {
    return articles.map((article, i) => {
        article = article.toObject();
        article.comment_count = commentCounts[i];
        return article;
    });
}