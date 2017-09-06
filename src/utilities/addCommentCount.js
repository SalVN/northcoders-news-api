const path = require('path');
const { Comments } = require(path.resolve(__dirname, '../..', 'models', 'models'));

exports.findArticleCommentCount = function (articles) {
    return articles.map(user => {
        return Comments.count({ belongs_to: user._id });
    });
};

exports.addArticleCommentCount = function (articles, commentCounts) {
    return articles.map((article, i) => {
        article = article.toObject();
        article.comment_count = commentCounts[i];
        return article;
    });
};