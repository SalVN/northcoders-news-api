const path = require('path');
const { Comments } = require(path.resolve(__dirname, '../..', 'models', 'models'));

exports.findArrayCommentCount = function (array) {
    return array.map(user => {
        return Comments.count({ belongs_to: user._id });
    });
};

exports.addArrayCommentCount = function (array, commentCounts) {
    return array.map((el, i) => {
        el = el.toObject();
        el.comment_count = commentCounts[i];
        return el;
    });
};

exports.findOneCommentCount = function (obj) {
    return Comments.count({belongs_to: obj._id});
};

exports.addOneCommentCount = function (obj, commentCount) {
    obj.comment_count = commentCount;
    return obj;
};

exports.findOneCommentCountUser = function (obj) {
    return Comments.count({created_by: obj.username});
};

exports.findArrayCommentCountUser = function (array) {
    return array.map(user => {
        return Comments.count({created_by: user.username});
    });
};
