const path = require('path');
const { Users } = require(path.resolve(__dirname, '../..', 'models', 'models'));

module.exports = (req, res, next) => {
    Users.find({})
        .then(users => {
            res.status(200).json({ users: users });
        })
        .catch(err => {
            next(err);
        });
};