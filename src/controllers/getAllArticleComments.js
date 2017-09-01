const path = require('path');

const { Comments } = require(path.resolve(__dirname, '../..', 'models', 'models'));

module.exports = (req, res, next) => {
    const { article_id } = req.params;
    Comments.find({ belongs_to: article_id })
        .then(comments => {
            res.status(200).json({ comments });
        })
        .catch(err => {
            next(err);
        });
};