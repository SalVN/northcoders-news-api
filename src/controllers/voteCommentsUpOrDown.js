const path = require('path');
const { Comments } = require(path.resolve(__dirname, '../..', 'models', 'models'));

const defineQueryVote = require(path.resolve(__dirname, '..', 'utilities', 'defineQueryVote'));

module.exports = (req, res, next) => {
    const { comment_id } = req.params;
    const vote = defineQueryVote(req, res, next);
    Comments.findOneAndUpdate({ _id: comment_id }, { $inc: { votes: vote } }, { new: true })
        .then(comment => {
            res.status(200).json({ comment });
        }).catch(err => {
            if (err.name === 'CastError') return next({ status: 404, message: 'COMMENT NOT FOUND' });
            next(err);
        });
};