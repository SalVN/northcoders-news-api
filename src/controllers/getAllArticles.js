const path = require('path');

const {Articles} = require(path.resolve(__dirname, '../..', 'models', 'models'));

module.exports = (req, res, next) => {
    Articles.find({})
    .then(articles => {
        res.status(200).json({articles});
    })
    .catch(err => {
        next(err);
    });
};