const path = require('path');
const { Articles } = require(path.resolve(__dirname, '../..', 'models', 'models'));

module.exports = (req, res, next) => {
    const { article_id } = req.params;
    const query = req.query;
    let vote;
    if (query.vote === 'up') vote = 1;
    if (query.vote === 'down') vote = -1;
    Articles.findOneAndUpdate({ _id: article_id }, { $inc: { votes: vote } }, { new: true })
        .then((article) => {
            res.status(200).json({article});
        }).catch(err => {
            next(err);
        });
};