const path = require('path');
const {Users} = require(path.resolve(__dirname, '../..', 'models', 'models'));

module.exports = (req, res, next) => {
    const {username} = req.params;
    Users.findOne({username: username})
    .then (user => {
        res.status(200).json({user});
    })
    .catch(err => {
        next(err);
    });
};