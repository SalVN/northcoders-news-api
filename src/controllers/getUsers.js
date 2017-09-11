const path = require('path');
const { Users } = require(path.resolve(__dirname, '../..', 'models', 'models'));
const { findArrayCommentCountUser, addArrayCommentCount } = require(path.resolve(__dirname, '..', 'utilities', 'addCommentCount'));
const { getArrayArticles, addArrayArticleVotes } = require(path.resolve(__dirname, '..', 'utilities', 'getUserArticleVotes.utilities'));
const { getArrayComments, addArrayCommentVotes } = require(path.resolve(__dirname, '..', 'utilities', 'getUserCommentVotes.utilities'));

module.exports = (req, res, next) => {
    let updatedUsers;
    Users.find({})
        .then(users => {
            Promise.all(findArrayCommentCountUser(users))
                .then(commentCounts => {
                    updatedUsers = addArrayCommentCount(users, commentCounts);
                    Promise.all(getArrayArticles(updatedUsers))
                        .then(articles => {
                            updatedUsers = addArrayArticleVotes(updatedUsers, articles);
                            Promise.all(getArrayComments(updatedUsers))
                                .then(comments => {
                                    updatedUsers = addArrayCommentVotes(updatedUsers, comments);
                                    res.status(200).json({ users: updatedUsers });
                                });
                        });
                });
        })
        .catch(err => {
            next(err);
        });
};