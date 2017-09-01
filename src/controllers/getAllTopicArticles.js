const path = require('path');

const { Articles } = require(path.resolve(__dirname, '../..', 'models', 'models'));

module.exports = (req, res, next) => {
    const { topic_id } = req.params;
    Articles.find({ belongs_to: topic_id })
        .then(articles => {
            res.status(200).json({ articles });
        })
        .catch(err => {
            next(err);
        });
};