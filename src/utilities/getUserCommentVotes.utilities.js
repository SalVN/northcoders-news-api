const path = require('path');
const { Comments } = require(path.resolve(__dirname, '../..', 'models', 'models'));

exports.getUserComments = function (user) {
    return Comments.find({created_by: user});
};