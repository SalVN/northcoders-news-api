const path = require('path');
const { Users } = require(path.resolve(__dirname, '../..', 'models', 'models'));
const { findArrayCommentCountUser, addArrayCommentCount } = require(path.resolve(__dirname, '..', 'utilities', 'addCommentCount'));

module.exports = (req, res, next) => {
    console.log('getusers');
    let updatedUsers;
    Users.find({})
        .then(users => {
            Promise.all(findArrayCommentCountUser(users))
                .then(commentCounts => {
                    updatedUsers = addArrayCommentCount(users, commentCounts);
                    res.status(200).json({ users: updatedUsers });
                });
        })
        .catch(err => {
            next(err);
        });
};