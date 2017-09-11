const path = require('path');
const { Users } = require(path.resolve(__dirname, '../..', 'models', 'models'));
const { findOneCommentCountUser, addOneCommentCount } = require(path.resolve(__dirname, '..', 'utilities', 'addCommentCount'));
const { getUserArticles, calculateUserArticleVotes, addUserArticleVotes } = require(path.resolve(__dirname, '..', 'utilities', 'getUserArticleVotes.utilities'));
const { getUserComments, calculateUserCommentVotes, addUserCommentVotes } = require(path.resolve(__dirname, '..', 'utilities', 'getUserCommentVotes.utilities'));

module.exports = (req, res, next) => {
    const { username } = req.params;
    Users.findOne({ username: username })
        .then(user => {
            if (user === null) return next({ status: 404, message: 'USER NOT FOUND' });
            user = user.toObject();
            Promise.all([findOneCommentCountUser(user), getUserArticles(user.username), getUserComments(user.username)])
                .then(counts => {
                    let updatedUser = addOneCommentCount(user, counts[0]);
                    updatedUser = addUserArticleVotes(user, calculateUserArticleVotes(counts[1]));
                    updatedUser = addUserCommentVotes(user, calculateUserCommentVotes(counts[2]));
                    res.status(200).json({ user: updatedUser });
                });
        })
        .catch(err => {
            next(err);
        });
};