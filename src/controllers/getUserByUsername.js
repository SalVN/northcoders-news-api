const path = require('path');
const { Users } = require(path.resolve(__dirname, '../..', 'models', 'models'));
const { findOneCommentCountUser, addOneCommentCount } = require(path.resolve(__dirname, '..', 'utilities', 'addCommentCount'));

module.exports = (req, res, next) => {
    const { username } = req.params;
    Users.findOne({ username: username })
        .then(user => {
            if (user === null) return next({ status: 404, message: 'USER NOT FOUND' });
            user = user.toObject();
            findOneCommentCountUser(user)
                .then(commentCount => {
                    let updatedUser = addOneCommentCount(user, commentCount);
                    res.status(200).json({ user: updatedUser });
                });
        })
        .catch(err => {
            next(err);
        });
};