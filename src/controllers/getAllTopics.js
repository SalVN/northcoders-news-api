const path = require('path');

const {Topics} = require(path.resolve(__dirname, '../..', 'models', 'models'));

module.exports = (req, res, next) => {
    Topics.find({})
    .then(topics => {
        res.status(200).json({topics});
    })
    .catch(err => {
        next(err);
    });
};